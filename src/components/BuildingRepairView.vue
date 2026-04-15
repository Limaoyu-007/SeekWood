<template>
  <div class="repair-container">
    <!-- 顶部导航条 -->
    <div class="top-nav">
      <button class="back-btn" @click="$emit('back')">← 退出造办处</button>
      <h2 class="building-title">【大匠造办】{{ currentBuilding.name }}</h2>
    </div>

    <!-- 2.5D 建筑底图容器 -->
    <div class="building-canvas" :class="{'reveal-photo': isFullyRepaired}">
      
      <!-- 实景图背景 (透明度与滤镜由 CSS 控制) -->
      <div class="real-photo-bg" :style="{ backgroundImage: 'url(' + currentBuilding.realPhoto + ')' }"></div>

      <!-- 建筑蓝图 SVG 手绘效果 -->
      <div class="blueprint-container">
        <svg class="building-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <g class="blueprint-lines" stroke="#5c3a21" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- 柱基 -->
            <path d="M 220 500 L 280 500 M 520 500 L 580 500" stroke-width="3"/>
            <path d="M 230 490 L 270 490 M 530 490 L 570 490" stroke-width="3"/>
            
            <!-- 柱子 -->
            <path d="M 250 490 L 250 250 M 550 490 L 550 250" stroke-width="4" />
            <path d="M 120 490 L 120 300 M 680 490 L 680 300" stroke-width="3" opacity="0.4"/> 
            
            <!-- 额枋与阑额 -->
            <path d="M 100 320 L 700 320 M 100 290 L 700 290" stroke-width="2"/>
            <path d="M 220 250 L 580 250 M 240 230 L 560 230" stroke-width="3"/>

            <!-- 斗拱叠涩 -->
            <g class="dougong" stroke-width="1.5">
              <path d="M 230 250 L 230 220 L 270 220 L 270 250 M 210 220 L 210 190 L 290 190 L 290 220" />
              <path d="M 190 190 L 190 160 L 310 160 L 310 190" />
              <path d="M 530 250 L 530 220 L 570 220 L 570 250 M 510 220 L 510 190 L 590 190 L 590 220" />
              <path d="M 490 190 L 490 160 L 610 160 L 610 190" />
              <path d="M 380 250 L 380 220 L 420 220 L 420 250 M 360 220 L 360 190 L 440 190 L 440 220"/>
              <path d="M 340 190 L 340 160 L 460 160 L 460 190" />
            </g>

            <!-- 屋顶轮廓与飞檐 -->
            <path d="M 400 40 Q 600 70 760 180 L 730 210 Q 600 110 400 80 Q 200 110 70 210 L 40 180 Q 200 70 400 40 Z" stroke-width="3" fill="rgba(92, 58, 33, 0.03)" />
            <!-- 瓦楞竖线 -->
            <path d="M 400 40 L 400 80 M 350 45 L 340 90 M 450 45 L 460 90 M 300 55 L 280 105 M 500 55 L 520 105 M 250 70 L 220 130 M 550 70 L 580 130 M 200 90 L 160 160 M 600 90 L 640 160 M 150 120 L 100 190 M 650 120 L 700 190" stroke-width="1.5" opacity="0.6"/>

            <!-- 门窗 -->
            <g class="doors" stroke-width="1.5" opacity="0.8">
              <path d="M 320 490 L 320 320 M 480 490 L 480 320" />
              <path d="M 360 490 L 360 320 M 440 490 L 440 320" />
              <path d="M 400 490 L 400 320" />
              <path d="M 320 350 L 480 350 M 320 380 L 480 380 M 320 410 L 480 410" opacity="0.4"/>
            </g>
            
            <!-- 台基 -->
            <path d="M 80 500 L 720 500 L 740 540 L 60 540 Z" stroke-width="2"/>
            <path d="M 350 540 L 450 540 M 340 560 L 460 560 M 330 580 L 470 580" />
            <path d="M 350 540 L 330 580 M 450 540 L 470 580" />
          </g>
        </svg>
      </div>

      <!-- 渲染热区 -->
      <div 
        v-for="spot in currentBuilding.hotspots" 
        :key="spot.id"
        class="hotspot"
        :class="{ repaired: spot.isRepaired }"
        :style="{ left: spot.x, top: spot.y }"
        @click="onHotspotClick(spot)"
      >
        <div class="ring"></div>
        <div class="dot"></div>
        <div class="label">{{ spot.label }}</div>
      </div>
    </div>

    <!-- 背包弹窗：点击热区后弹出 -->
    <transition name="fade-slide">
      <div v-if="activeHotspot" class="inventory-modal-bg" @click.self="closeInventory">
        <div class="inventory-modal">
          <div class="modal-header">
            <h3>修复: {{ activeHotspot.label }}</h3>
            <button class="close-btn" @click="closeInventory">✕</button>
          </div>
          <p class="modal-desc">请从行囊中选择合适的榫卯构件：</p>
          
          <div class="inventory-grid">
            <div v-if="store.inventory.length === 0" class="empty-hint">
              你的行囊空空如也，请先去闯关收集榫卯！
            </div>
            <button 
              v-else
              v-for="jId in store.inventory" 
              :key="jId"
              class="joint-item"
              @click="submitJoint(jId)"
            >
              {{ getJointName(jId) }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 鲁班教诲（AI判错反馈弹窗） -->
    <transition name="pop">
      <div v-if="aiFeedback" class="feedback-modal">
        <div class="luban-avatar">🤖 鲁班</div>
        <div class="feedback-content">
          <p class="typing-text">{{ aiFeedback }}</p>
          <button class="action-btn" @click="aiFeedback = null">领教了</button>
        </div>
      </div>
    </transition>

    <!-- 修复成功展示弹窗 -->
    <transition name="pop">
      <div v-if="successSpot" class="success-modal-bg">
        <div class="success-modal">
          <h2>🎉 修复成功！</h2>
          <p class="success-sub">结构【{{ successSpot.label }}】已稳固如初。</p>
          
          <div class="culture-card">
            <!-- 占位实景图（此处使用网络图作为演示，后续可替换本地资产） -->
            <img :src="currentBuilding.realPhoto" alt="实景图" class="real-photo" />
            <p class="culture-text">{{ currentBuilding.cultureText }}</p>
          </div>
          
          <button class="action-btn primary" @click="closeSuccess">继续造办</button>
        </div>
      </div>
    </transition>

    <!-- AI 思考加载中层 -->
    <div v-if="isAiThinking" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>鲁班大师沉思中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, unlockBuilding } from '../store';
import { fetchRepairFeedback } from '../utils/aiRepairCheck';

// ── 基础数据 ───────────────────────────────────────────────
const emit = defineEmits(['back']);

// 榫卯中英映射表
const JOINT_NAMES = {
  straight: '直榫',
  dovetail: '燕尾榫',
  crosslap: '十字搭接',
  doubletenon: '双榫',
  twojoint: '双联卯眼',
  stoppedDovetail: '半隐燕尾榫',
  miteredCorner: '粽角榫',
  cloudJoint: '勾挂榫',
  paWangJoint: '霸王枨',
  lubanLock: '鲁班三才锁'
};

const getJointName = (id) => JOINT_NAMES[id] || '未知榫卯';

// 建筑数据 Mock（为了演示直接写在组件里，将来可以抽取到配置表）
const currentBuilding = ref({
  id: 'huguang',
  name: '重庆湖广会馆',
  // 背景由于使用了CSS纸张纹理，不再需要此处的渐变背景数据
  realPhoto: 'https://images.unsplash.com/photo-1542858880-9285038b309f?auto=format&fit=crop&w=600&q=80',
  cultureText: '湖广会馆始建于明末清初，其戏台建筑是国内保存最完好的木结构戏台之一。这里汇聚了精妙的飞檐与穿斗式木构框架，展示了古人非凡的力学与美学造诣。',
  hotspots: [
    {
      id: 'hs1',
      label: '戏台屋檐转角',
      x: '30%',
      y: '40%',
      requiredJoint: 'dovetail', // 设定这里的正确修复材料是【燕尾榫】
      isRepaired: false
    },
    {
      id: 'hs2',
      label: '主梁与檐柱交接点',
      x: '65%',
      y: '50%',
      requiredJoint: 'crosslap', // 设定这的正确材料是【十字搭接】
      isRepaired: false
    }
  ]
});

// ── 状态管理 ───────────────────────────────────────────────
const activeHotspot = ref(null);
const aiFeedback = ref(null);
const isAiThinking = ref(false);
const successSpot = ref(null);
const isFullyRepaired = ref(false);

// ── 交互逻辑 ───────────────────────────────────────────────

// 1. 点击热区
const onHotspotClick = (spot) => {
  if (spot.isRepaired) return; // 已经修好了不可点
  activeHotspot.value = spot;
};

// 关闭背包
const closeInventory = () => {
  activeHotspot.value = null;
};

// 2. 在背包中选中榫卯并提交
const submitJoint = async (jointId) => {
  const spot = activeHotspot.value;
  if (!spot) return;
  activeHotspot.value = null; // 提交后关闭背包弹窗

  if (jointId === spot.requiredJoint) {
    // 匹配成功！
    spot.isRepaired = true;
    successSpot.value = spot;
    checkBuildingUnlock();
  } else {
    // 匹配失败！呼叫 AI
    isAiThinking.value = true;
    
    const structureName = spot.label;
    const wrongName = getJointName(jointId);
    const rightName = getJointName(spot.requiredJoint);

    const reply = await fetchRepairFeedback(structureName, wrongName, rightName);
    
    isAiThinking.value = false;
    aiFeedback.value = reply;
  }
};

// 检查是否整个建筑的热区都修完了
const checkBuildingUnlock = () => {
  const allDone = currentBuilding.value.hotspots.every(s => s.isRepaired);
  if (allDone) {
    unlockBuilding(currentBuilding.value.id);
    // 延迟显示实景图，配合成功弹窗的出现
    setTimeout(() => {
      isFullyRepaired.value = true;
    }, 500);
  }
};

// 关闭成功弹窗
const closeSuccess = () => {
  successSpot.value = null;
};
</script>

<style scoped>
/* ── 容器与背景 ── */
.repair-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #f4e8d1; /* 米黄纸质底色 */
  overflow: hidden;
}

.building-canvas {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 实景图与渐隐蓝图 */
.real-photo-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  z-index: 3;
  margin: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  transition: opacity 2s ease-in-out, filter 2s;
  filter: sepia(0.5) grayscale(0.5) blur(4px);
  pointer-events: none;
}
.building-canvas.reveal-photo .real-photo-bg {
  opacity: 0.85; /* 保留一点底层纸张质感 */
  filter: sepia(0) grayscale(0) blur(0);
}

.blueprint-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 4;
  transition: opacity 2s ease-in-out;
}
.building-canvas.reveal-photo .blueprint-container {
  opacity: 0.15; /* 修订后线稿隐约留底 */
}

.building-svg {
  width: 90%;
  max-width: 850px;
  height: auto;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.1));
}
.blueprint-lines path {
  stroke-dasharray: 4000;
  stroke-dashoffset: 4000;
  animation: draw-sketch 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
@keyframes draw-sketch {
  to { stroke-dashoffset: 0; }
}
.blueprint-lines path:nth-child(3n) { animation-delay: 0.5s; }
.blueprint-lines path:nth-child(3n+1) { animation-delay: 0.2s; }
.blueprint-lines path:nth-child(3n+2) { animation-delay: 0.8s; }

/* 纸张噪点与纹理 */
.building-canvas::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-image: 
    radial-gradient(circle at 50% 50%, transparent 20%, #d8c3a5 100%),
    repeating-linear-gradient(45deg, rgba(139,90,43,0.05) 0px, rgba(139,90,43,0.05) 2px, transparent 2px, transparent 4px),
    repeating-linear-gradient(-45deg, rgba(139,90,43,0.05) 0px, rgba(139,90,43,0.05) 2px, transparent 2px, transparent 4px);
  pointer-events: none;
  z-index: 1;
}

/* 纸张边缘暗角与轻微褶皱 */
.building-canvas::after {
  content: "";
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 100px rgba(100, 60, 20, 0.3);
  background: 
    linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.08"/></svg>');
  pointer-events: none;
  z-index: 2;
}

/* ── 顶部导航 ── */
.top-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 10;
}
.back-btn {
  background: transparent;
  border: 1px solid rgba(200,160,80,0.5);
  color: #f0deb0;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
}
.back-btn:hover { background: rgba(200,160,80,0.2); }
.building-title {
  color: #f0d080;
  font-family: "楷体", serif;
  margin-left: 20px;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

/* ── 热区动画样式 ── */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  mix-blend-mode: multiply; /* 融入纸张产生水墨晕染感 */
}

/* 朱砂红墨迹感圆点 */
.hotspot .dot {
  width: 20px;
  height: 20px;
  background: #b22222;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  box-shadow: inset -2px -2px 6px rgba(0,0,0,0.3), 0 0 6px rgba(178,34,34,0.6);
  position: relative;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 6;
  animation: ink-breathe 4s infinite alternate;
}

@keyframes ink-breathe {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: scale(1); }
  100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; transform: scale(1.1); }
}

/* 外围毛笔圈画效果 */
.hotspot .ring {
  position: absolute;
  top: -14px;
  left: -14px;
  width: 44px;
  height: 44px;
  border: 2px dashed #b22222;
  border-radius: 35% 65% 55% 45%;
  animation: spin-pulse 4s linear infinite;
  opacity: 0.7;
  z-index: 5;
}

@keyframes spin-pulse {
  0% { transform: rotate(0deg) scale(0.9); opacity: 0.8; border-radius: 35% 65% 55% 45%; }
  50% { transform: rotate(180deg) scale(1.1); opacity: 0.4; border-radius: 65% 35% 45% 55%; }
  100% { transform: rotate(360deg) scale(0.9); opacity: 0.8; border-radius: 35% 65% 55% 45%; }
}

.hotspot.repaired .dot {
  background: #2e8b57; /* 翠绿墨汁 */
  box-shadow: inset -2px -2px 6px rgba(0,0,0,0.3), 2px 2px 5px rgba(0,0,0,0.2);
  transform: scale(0.85);
  animation: none;
  border-radius: 50% 40% 60% 50% / 40% 60% 50% 50%;
}
.hotspot.repaired .ring {
  display: none; /* 修复后停止闪烁发光 */
}

.hotspot .label {
  background: rgba(244, 232, 209, 0.9);
  color: #5c3a21;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: "楷体", serif;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  border: 1px solid #c8a165;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
  z-index: 6;
}
.hotspot.repaired .label {
  border-color: #2e8b57;
  color: #2e8b57;
}

/* ── 弹窗通用样式 ── */
.inventory-modal-bg, .success-modal-bg {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  backdrop-filter: blur(4px);
}

/* ── 背包弹窗 ── */
.inventory-modal {
  background: #e6e2d3; /* 古籍纸张色 */
  border: 2px solid #8b5a2b;
  border-radius: 12px;
  width: 400px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  color: #333;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #8b5a2b; padding-bottom: 10px; margin-bottom: 15px;}
.modal-header h3 { margin: 0; font-family: "楷体", serif; color: #8b5a2b; font-size: 22px;}
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #8b5a2b;}
.modal-desc { font-size: 14px; margin-bottom: 20px; color: #555; }
.inventory-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.joint-item {
  padding: 12px;
  background: #f7f5ec;
  border: 1px solid #c8a165;
  border-radius: 8px;
  font-family: "楷体", serif;
  font-size: 16px;
  color: #5c3a1e;
  cursor: pointer;
  transition: all 0.2s;
}
.joint-item:hover { background: #8b5a2b; color: #fff; transform: translateY(-2px); }
.empty-hint { grid-column: span 2; text-align: center; color: #999; font-style: italic; padding: 20px 0;}

/* ── AI 鲁班反馈弹窗 ── */
.feedback-modal {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 320px;
  background: rgba(40,25,10,0.9);
  border: 2px solid #d4a96a;
  border-radius: 12px;
  padding: 20px;
  color: #f0deb0;
  z-index: 30;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
}
.luban-avatar { font-family: "楷体", serif; font-size: 18px; color: #f0d080; border-bottom: 1px dashed #d4a96a; padding-bottom: 8px; margin-bottom: 12px;}
.feedback-content p { font-size: 15px; line-height: 1.6; margin-bottom: 15px;}
.action-btn { background: #8b5a2b; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: block; width: 100%;}
.action-btn:hover { background: #6b431e; }

/* ── 修复成功弹窗 ── */
.success-modal {
  background: linear-gradient(to bottom, #f9f6e8, #e6e2d3);
  border: 4px solid #c89a5a;
  border-radius: 16px;
  width: 480px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 15px 50px rgba(0,0,0,0.6);
}
.success-modal h2 { color: #d32f2f; font-family: "楷体", serif; font-size: 32px; margin: 0 0 10px 0;}
.success-sub { color: #555; font-size: 16px; margin-bottom: 24px;}
.culture-card {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 24px;
}
.real-photo { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 15px;}
.culture-text { font-size: 14px; color: #444; line-height: 1.6; text-align: left;}

/* ── 加载态 ── */
.loading-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50; color: #f0d080; font-family: "楷体", serif; letter-spacing: 2px; font-size: 18px;
}
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid rgba(240,208,128,0.2); border-top-color: #f0d080; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;
}

/* ── 动画 ── */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(20px); }
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { animation: pop-in 0.3s reverse ease-in; }
@keyframes pop-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); }}
@keyframes spin { 100% { transform: rotate(360deg); }}
</style>
