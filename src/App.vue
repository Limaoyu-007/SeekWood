<template>
  <div class="app-wrapper">
    <!-- 开场动画 -->
    <IntroSplash v-if="showIntro" @done="showIntro = false" />

    <!-- 层级 1: Three.js 3D 画布（底层），传入当前关卡配置 -->
    <ThreeViewer 
      :level="currentLevel"
      :key="levelKey"
      @assemble-success="onLevelPass"
    />

    <!-- 层级 2: UI 覆盖层 -->
    <div class="ui-overlay">
      <!-- 标题 -->
      <div class="title-block">
        <h1 class="game-title">寻木·榫卯</h1>
        <p class="game-sub">中·国·古·建·筑·益·智</p>
      </div>

      <!-- 右上角 UI 组合 -->
      <div class="top-right-ui">
        <!-- 导航按钮组 -->
        <div class="nav-btn-group">
          <button class="nav-btn" @click="currentView = 'guide'">📖 图鉴</button>
          <button class="nav-btn accent" @click="currentView = 'assembly'">🏗 拼装</button>
        </div>

        <!-- 关卡信息徽章 -->
        <div class="level-badge">
          第 {{ currentLevel.id }} 关 · {{ currentLevel.name }}
        </div>
      </div>

      <!-- 通关成功弹窗 -->
      <transition name="toast-pop">
        <div v-if="showSuccess" class="success-overlay">
          <div class="success-card">
            <div class="success-icon">{{ currentLevel.successEmoji }}</div>
            <h2 class="success-title">{{ currentLevel.successTitle }}</h2>
            <p class="success-desc">{{ currentLevel.successDesc }}</p>
            <div class="action-row">
              <!-- 如果有下一关就显示"下一关"，否则显示"通关" -->
              <button v-if="hasNextLevel" class="action-btn primary" @click="goNextLevel">
                下一关 →
              </button>
              <button v-else class="action-btn primary" @click="restartGame">
                🏆 再挑战
              </button>
              <button class="action-btn secondary" @click="replayLevel">
                ↺ 重玩本关
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 层级 3: AI 伴学聊天窗 -->
    <div class="ai-box-wrapper">
      <button class="ai-toggle-btn" @click="showChat = !showChat">
        {{ showChat ? '✕ 收起' : '🤖 问鲁班' }}
      </button>
      <transition name="slide-up">
        <AIChatBox v-if="showChat" />
      </transition>
    </div>

    <!-- 层级 4: 图鉴页（从顶部滑入） -->
    <transition name="slide-guide">
      <GuideView v-if="currentView === 'guide'" @back="currentView = 'game'" />
    </transition>

    <!-- 层级 5: 自由拼装（从底部滑入） -->
    <transition name="slide-assembly">
      <AssemblyView v-if="currentView === 'assembly'" @back="currentView = 'game'" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ThreeViewer   from './components/ThreeViewer.vue';
import AIChatBox     from './components/AIChatBox.vue';
import GuideView     from './components/GuideView.vue';
import AssemblyView  from './components/AssemblyView.vue';
import IntroSplash   from './components/IntroSplash.vue';

// ── 页面控制 ──────────────────────────────────────────
const currentView = ref('game'); // 'game' | 'guide' | 'assembly'
const showIntro   = ref(true);

// ── 关卡数据表 ────────────────────────────────────────────────
// 每一关定义自己的名称、说明、3D 参数，ThreeViewer 根据 level 对象渲染不同的榫卯
const LEVELS = [
  {
    id: 1, name: '直榫', type: 'straight',
    successEmoji: '🎉', successTitle: '巧夺天工！',
    successDesc: '直榫是榫卯中最基础的形制，\n一凸一凹，严丝合缝，承载千年梁柱之重。',
  },
  {
    id: 2, name: '燕尾榫', type: 'dovetail',
    successEmoji: '🪶', successTitle: '匠心独运！',
    successDesc: '榫头先旋转，再侧推入卯——自锁结构，名不虚传！',
  },
  {
    id: 3, name: '十字搭接', type: 'crosslap',
    successEmoji: '✚', successTitle: '浑然天成！',
    successDesc: '两梁垂直交叉，各凿半深缺口，\n嵌合后顶面齐平——古建框格节点的通用做法。',
  },
  {
    id: 4, name: '双榫', type: 'doubletenon',
    successEmoji: '🏆', successTitle: '登峰造极！',
    successDesc: '双榫同时对准两个卯眼，抗扭转能力倍增。\n四大榫卯尽数掌握，当属木匠大师！',
  },
  {
    id: 5, name: '双联卯眼', type: 'twojoint',
    successEmoji: '🎊', successTitle: '出神入化！',
    successDesc: '两榫同时归位，一旋一插！\n恭喜通关全部五关——快去拼装模块搭建古建房架！',
  },
  {
    id: 6, name: '半隐燕尾榫', type: 'stoppedDovetail',
    successEmoji: '🛡️', successTitle: '神乎其技！',
    successDesc: '半隐燕尾榫外表不露痕迹，内里却紧紧咬合。\n这是古建家具中平衡美感与强度的上佳选择。',
  },
  {
    id: 7, name: '粽角榫 (三碰肩)', type: 'miteredCorner',
    successEmoji: '🏯', successTitle: '登峰造极！',
    successDesc: '粽角榫是明清家具中最具代表性的榫卯之一。\n三根木材在角落交汇，形成完美的45度合缝，极其考验精度。',
  },
  {
    id: 8, name: '勾挂榫 (云朵榫)', type: 'cloudJoint',
    successEmoji: '☁️', successTitle: '如鱼得水！',
    successDesc: '勾挂榫又称云纹榫，其钩状结构形成了天然的拉力锁。\n曲线优美且坚固无比，常用于圆桌和园林建筑。',
  },
  {
    id: 9, name: '霸王枨 (带楔锁定)', type: 'paWangJoint',
    successEmoji: '👑', successTitle: '力拔山河！',
    successDesc: '霸王枨不仅依靠S曲线分担压力，更妙在最后的楔子锁定。\n大件就位，小件固死——这便是复合拼装的精髓。',
  },
  {
    id: 10, name: '终极挑战：鲁班三才锁', type: 'lubanLock',
    successEmoji: '💎', successTitle: '天工巧夺！',
    successDesc: '恭喜你完成了全部十关挑战！\n鲁班锁三轴合一，自成方圆。这种绝学已流传两千年，现在你也是这门技艺的传承人。',
  },
];

const currentLevelIndex = ref(0);
const currentLevel      = computed(() => LEVELS[currentLevelIndex.value]);
const hasNextLevel      = computed(() => currentLevelIndex.value < LEVELS.length - 1);

// key 变化时强制重建 ThreeViewer（重置整个 3D 场景）
const levelKey = ref(0);

const showSuccess = ref(false);
const showChat    = ref(false);

// 拼装成功回调
const onLevelPass = () => {
  showSuccess.value = true;
};

// 前往下一关
const goNextLevel = () => {
  currentLevelIndex.value++;
  levelKey.value++;         // 触发 ThreeViewer 重建
  showSuccess.value = false;
};

// 重玩本关
const replayLevel = () => {
  levelKey.value++;
  showSuccess.value = false;
};

// 全部通关后重新开始
const restartGame = () => {
  currentLevelIndex.value = 0;
  levelKey.value++;
  showSuccess.value = false;
};
</script>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* ── UI 覆盖层 ── */
.ui-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

/* ── 标题组 ── */
.title-block {
  position: absolute;
  top: 28px;
  left: 32px;
}
.game-title {
  font-family: "楷体", "STKaiti", serif;
  font-size: 36px;
  color: #f0d080;
  text-shadow: 0 2px 12px rgba(200,140,40,0.6), 2px 2px 0 #5a340a;
  letter-spacing: 4px;
  line-height: 1;
  margin: 0;
}
.game-sub {
  font-size: 11px;
  letter-spacing: 6px;
  color: rgba(200,170,90,0.6);
  margin-top: 5px;
}

/* ── 右上角 UI 组合 ── */
.top-right-ui {
  position: absolute;
  top: 28px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: none;
  z-index: 25;
}

/* ── 关卡徽章 ── */
.level-badge {
  background: rgba(15, 12, 6, 0.75);
  border: 1px solid rgba(212, 169, 106, 0.4);
  border-radius: 24px;
  padding: 8px 22px;
  color: #f0deb0;
  font-family: "楷体", serif;
  font-size: 15px;
  letter-spacing: 2px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  white-space: nowrap;
}

/* ── 通关成功弹窗 ── */
.success-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  pointer-events: auto;
  backdrop-filter: blur(5px);
}
.success-card {
  background: linear-gradient(145deg, #2d1c08, #1a0f04);
  border: 2px solid #c89a5a;
  border-radius: 20px;
  padding: 48px 60px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7),
              inset 0 1px 0 rgba(255,220,120,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 480px;
}
.success-icon {
  font-size: 68px;
  animation: bounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.success-title {
  font-family: "楷体", serif;
  font-size: 38px;
  color: #f0d080;
  margin: 0;
  text-shadow: 0 0 24px rgba(240,208,128,0.5);
}
.success-desc {
  color: rgba(200, 170, 90, 0.85);
  font-size: 15px;
  line-height: 2.0;
  margin: 0;
  white-space: pre-line;  /* 支持 \n 换行 */
}
.action-row {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}
.action-btn {
  padding: 13px 30px;
  border: none;
  border-radius: 10px;
  font-family: "楷体", serif;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}
.action-btn.primary {
  background: linear-gradient(135deg, #c89a5a, #a0724a);
  color: #fff;
}
.action-btn.secondary {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(200,154,90,0.4);
  color: #d4a96a;
}

/* ── AI 聊天框区域 ── */
.ai-box-wrapper {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.ai-toggle-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b5a2b, #5c3a1e);
  border: 1px solid rgba(200,154,90,0.5);
  border-radius: 24px;
  color: #f0d080;
  font-family: "楷体", serif;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  transition: transform 0.15s;
}
.ai-toggle-btn:hover { transform: translateY(-2px); }

/* ── 导航按钮组（图鉴 + 拼装） ── */
.nav-btn-group {
  display: flex;
  gap: 8px;
  pointer-events: auto;
}
.nav-btn {
  background: rgba(15, 12, 6, 0.7);
  border: 1px solid rgba(212, 169, 106, 0.35);
  border-radius: 22px;
  padding: 8px 18px;
  color: #d4a96a;
  font-family: "楷体", serif;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.nav-btn:hover { 
  background: rgba(139, 90, 30, 0.6); 
  color: #f0d080;
  transform: translateY(-1px);
  border-color: rgba(212, 169, 106, 0.6);
}
.nav-btn.accent { 
  border-color: rgba(120, 200, 160, 0.45); 
  color: rgba(160, 220, 180, 0.9); 
}
.nav-btn.accent:hover { 
  background: rgba(40, 120, 80, 0.4); 
  color: #a0ffcc; 
  border-color: rgba(120, 255, 180, 0.6);
}

/* ── 图鉴页滑入过渡 ── */
.slide-guide-enter-active, .slide-guide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
}
.slide-guide-enter-from { transform: translateY(-100%); opacity: 0; }
.slide-guide-leave-to   { transform: translateY(-100%); opacity: 0; }

/* ── 拼装页：从底部滑入 ── */
.slide-assembly-enter-active, .slide-assembly-leave-active {
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
}
.slide-assembly-enter-from { transform: translateY(100%); opacity: 0; }
.slide-assembly-leave-to   { transform: translateY(100%); opacity: 0; }

/* ── 动画 ── */
.toast-pop-enter-active { animation: toastIn 0.4s ease; }
.toast-pop-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideUp 0.25s ease reverse; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%,100% { transform: scale(1); }
  40%      { transform: scale(1.3); }
  70%      { transform: scale(0.9); }
}
</style>
