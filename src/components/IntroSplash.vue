<template>
  <transition name="splash-fade">
    <div v-if="visible" class="splash-screen" @click="skip">

      <!-- 背景粒子（木屑飘落） -->
      <div class="particles">
        <span v-for="i in 30" :key="i" class="particle"
          :style="{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.15 + Math.random() * 0.35,
          }"
        ></span>
      </div>

      <!-- 水墨展开光晕 -->
      <div class="ink-wash" :class="{ expand: phase >= 1 }"></div>

      <!-- 中央主体内容 -->
      <div class="splash-center">

        <!-- 第一阶段：印章 -->
        <div class="seal" :class="{ show: phase >= 1 }">
          <div class="seal-box">
            <span class="seal-char">榫</span>
            <span class="seal-char">卯</span>
          </div>
        </div>

        <!-- 第二阶段：主标题 -->
        <h1 class="main-title" :class="{ show: phase >= 2 }">
          <span class="title-char" v-for="(ch, i) in '寻木·榫卯'" :key="i"
            :style="{ animationDelay: `${i * 0.12}s` }"
          >{{ ch }}</span>
        </h1>

        <!-- 第三阶段：副标题 -->
        <p class="sub-title" :class="{ show: phase >= 3 }">
          中国古建筑益智拼装游戏
        </p>

        <!-- 第四阶段：装饰线 + 引导语 -->
        <div class="deco-group" :class="{ show: phase >= 4 }">
          <div class="deco-line-h"></div>
          <p class="intro-text">
            不用一根铁钉，不施一滴胶水<br>
            以木为笔，以榫卯为墨，书写千年建筑传奇
          </p>
          <div class="deco-line-h"></div>
        </div>

        <!-- 第五阶段：数据亮点 -->
        <div class="stats-row" :class="{ show: phase >= 5 }">
          <div class="stat"><span class="stat-n">10</span><span class="stat-l">关卡挑战</span></div>
          <div class="stat-div"></div>
          <div class="stat"><span class="stat-n">7000</span><span class="stat-l">年传承</span></div>
          <div class="stat-div"></div>
          <div class="stat"><span class="stat-n">0</span><span class="stat-l">根铁钉</span></div>
        </div>

        <!-- 进入按钮 -->
        <button class="enter-btn" :class="{ show: phase >= 6 }" @click.stop="enter">
          <span class="enter-text">开始传承</span>
          <span class="enter-arrow">→</span>
        </button>
      </div>

      <!-- 底部署名 -->
      <div class="splash-footer" :class="{ show: phase >= 5 }">
        <span>寻木 · 榫卯 &mdash; Sunmao Craft</span>
      </div>

      <!-- 跳过提示 -->
      <div class="skip-hint" :class="{ show: phase >= 2 }">
        点击任意处跳过
      </div>

    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['done']);
const visible = ref(true);
const phase = ref(0);

let timers = [];

const schedule = (fn, delay) => {
  const id = setTimeout(fn, delay);
  timers.push(id);
};

onMounted(() => {
  // 分阶段依次展开
  schedule(() => { phase.value = 1; },  300);   // 印章 + 水墨
  schedule(() => { phase.value = 2; }, 1200);   // 主标题
  schedule(() => { phase.value = 3; }, 2200);   // 副标题
  schedule(() => { phase.value = 4; }, 3000);   // 装饰线 + 引导语
  schedule(() => { phase.value = 5; }, 3800);   // 数据亮点
  schedule(() => { phase.value = 6; }, 4600);   // 进入按钮
});

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
});

const enter = () => {
  visible.value = false;
  setTimeout(() => emit('done'), 600);
};

const skip = () => {
  if (phase.value >= 6) return; // 已经全部展开了就不跳过
  enter();
};
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0a0804;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  font-family: "楷体", "STKaiti", serif;
}

/* ── 退出动画 ── */
.splash-fade-leave-active {
  transition: opacity 0.6s ease;
}
.splash-fade-leave-to {
  opacity: 0;
}

/* ── 粒子（木屑飘落） ── */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.particle {
  position: absolute;
  top: -10px;
  background: #c89a5a;
  border-radius: 50%;
  animation: particleFall linear infinite;
}
@keyframes particleFall {
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(calc(100vh + 10px)) rotate(360deg); opacity: 0; }
}

/* ── 水墨光晕 ── */
.ink-wash {
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(200,140,40,0.08) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: width 2.5s ease-out, height 2.5s ease-out;
}
.ink-wash.expand {
  width: 160vmax;
  height: 160vmax;
}

/* ── 中央主体 ── */
.splash-center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* ── 印章 ── */
.seal {
  opacity: 0;
  transform: scale(0.3) rotate(-15deg);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.seal.show {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
.seal-box {
  display: flex;
  gap: 4px;
  border: 3px solid #c0392b;
  padding: 8px 14px;
  border-radius: 4px;
  background: rgba(192, 57, 43, 0.08);
}
.seal-char {
  font-size: 32px;
  color: #c0392b;
  font-weight: bold;
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(192, 57, 43, 0.4);
}

/* ── 主标题（逐字出现） ── */
.main-title {
  font-size: clamp(42px, 7vw, 72px);
  color: #f0d080;
  margin: 0;
  display: flex;
  gap: 2px;
  text-shadow: 0 0 40px rgba(240,208,128,0.4), 2px 4px 0 #5a340a;
}
.main-title .title-char {
  opacity: 0;
  transform: translateY(20px);
  display: inline-block;
}
.main-title.show .title-char {
  animation: charReveal 0.5s ease forwards;
}
@keyframes charReveal {
  to { opacity: 1; transform: translateY(0); }
}

/* ── 副标题 ── */
.sub-title {
  font-size: 16px;
  color: rgba(200,154,90,0.7);
  letter-spacing: 6px;
  margin: 0;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.6s ease 0.1s;
}
.sub-title.show {
  opacity: 1;
  transform: translateY(0);
}

/* ── 装饰线 + 引导语 ── */
.deco-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transition: all 0.8s ease;
}
.deco-group.show { opacity: 1; }
.deco-line-h {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c89a5a, transparent);
}
.intro-text {
  text-align: center;
  font-size: 14px;
  color: rgba(210,175,110,0.6);
  line-height: 2;
  margin: 0;
  letter-spacing: 1px;
}

/* ── 数据亮点 ── */
.stats-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.6s ease;
}
.stats-row.show {
  opacity: 1;
  transform: translateY(0);
}
.stat {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-n {
  font-size: 28px;
  color: #f0d080;
  font-weight: bold;
}
.stat-l {
  font-size: 11px;
  color: rgba(200,154,90,0.5);
  letter-spacing: 2px;
}
.stat-div {
  width: 1px;
  height: 28px;
  background: rgba(200,154,90,0.2);
}

/* ── 进入按钮 ── */
.enter-btn {
  margin-top: 16px;
  padding: 14px 48px;
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: "楷体", serif;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s ease;
}
.enter-btn.show {
  opacity: 1;
  transform: translateY(0);
}
.enter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(200,140,40,0.3);
}
.enter-text { letter-spacing: 3px; }
.enter-arrow {
  font-size: 22px;
  animation: arrowPulse 1.2s ease-in-out infinite;
}
@keyframes arrowPulse {
  0%,100% { transform: translateX(0); }
  50%     { transform: translateX(6px); }
}

/* ── 底部署名 ── */
.splash-footer {
  position: absolute;
  bottom: 24px;
  font-size: 12px;
  color: rgba(200,154,90,0.25);
  letter-spacing: 3px;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.splash-footer.show { opacity: 1; }

/* ── 跳过提示 ── */
.skip-hint {
  position: absolute;
  top: 24px;
  right: 28px;
  font-size: 12px;
  color: rgba(200,154,90,0.25);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.skip-hint.show { opacity: 1; }
</style>
