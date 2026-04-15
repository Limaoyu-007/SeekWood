<template>
  <transition name="fade-up">
    <div v-if="active" class="story-overlay">
      <div class="character-container">
        <!-- 匠人立绘 / 头像 -->
        <div class="avatar-wrap">
          <div class="avatar-glow"></div>
          <div class="avatar-inner">
            <span class="avatar-emoji">🧔🏻‍♂️</span>
            <div class="avatar-title">工匠 · 鲁班</div>
          </div>
        </div>

        <!-- 对话框 -->
        <div class="dialogue-box">
          <div class="dialogue-header">
            <span class="header-dot"></span>
            <span class="header-text">古建遗响</span>
          </div>
          
          <div class="dialogue-body">
            <p class="text-content">{{ displayedText }}<span class="cursor" v-if="isTyping"></span></p>
          </div>

          <div class="dialogue-footer">
            <button v-if="!isTyping" class="next-btn" @click="handleNext">
              {{ isLast ? '开启传承' : '接 领 ➔' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  active: Boolean,
  stories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['next', 'finish']);

const currentIndex = ref(0);
const displayedText = ref('');
const isTyping = ref(false);
const isLast = ref(false);

const typeText = (text) => {
  isTyping.value = true;
  displayedText.value = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text[i];
      i++;
    } else {
      clearInterval(timer);
      isTyping.value = false;
    }
  }, 40);
};

const handleNext = () => {
  if (currentIndex.value < props.stories.length - 1) {
    currentIndex.value++;
    emit('next', currentIndex.value);
  } else {
    emit('finish');
  }
};

watch(() => props.active, (newVal) => {
  if (newVal && props.stories.length > 0) {
    currentIndex.value = 0;
    typeText(props.stories[currentIndex.value]);
  }
});

watch(currentIndex, (newIdx) => {
  typeText(props.stories[newIdx]);
  isLast.value = newIdx === props.stories.length - 1;
});

onMounted(() => {
  if (props.active && props.stories.length > 0) {
    typeText(props.stories[0]);
    isLast.value = props.stories.length === 1;
  }
});
</script>

<style scoped>
.story-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.character-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 600px;
  width: 90%;
}

/* ── 头像 ── */
.avatar-wrap {
  position: relative;
  width: 120px;
  height: 120px;
}
.avatar-glow {
  position: absolute;
  inset: -10px;
  background: #c89a5a;
  filter: blur(25px);
  opacity: 0.4;
  border-radius: 50%;
  animation: breathe 3s ease-in-out infinite alternate;
}
.avatar-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2d1c08, #1a0f04);
  border: 2px solid #c89a5a;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
}
.avatar-emoji { font-size: 54px; margin-top: -5px; }
.avatar-title {
  position: absolute;
  bottom: -15px;
  background: #c89a5a;
  color: #1a0f04;
  padding: 2px 14px;
  border-radius: 12px;
  font-family: "楷体", serif;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

/* ── 对话框 ── */
.dialogue-box {
  background: rgba(26, 15, 4, 0.95);
  border: 1px solid rgba(200, 154, 90, 0.4);
  border-radius: 12px;
  padding: 28px 36px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  backdrop-filter: blur(12px);
  position: relative;
}
.dialogue-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px dashed rgba(200, 154, 90, 0.3);
  padding-bottom: 12px;
}
.header-dot {
  width: 8px; height: 8px;
  background: #c0392b;
  border-radius: 50%;
  box-shadow: 0 0 8px #c0392b;
}
.header-text {
  font-family: "楷体", serif;
  font-size: 16px;
  color: #c89a5a;
  letter-spacing: 2px;
}

.dialogue-body {
  min-height: 80px;
}
.text-content {
  font-family: "楷体", serif;
  font-size: 19px;
  color: #f0deb0;
  line-height: 1.8;
  letter-spacing: 1px;
  margin: 0;
}
.cursor {
  display: inline-block;
  width: 8px; height: 1.2em;
  background: #c89a5a;
  margin-left: 4px;
  vertical-align: middle;
  animation: blink 0.8s infinite;
}

.dialogue-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
.next-btn {
  background: linear-gradient(135deg, #c89a5a, #8b5a2b);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 10px 32px;
  font-family: "楷体", serif;
  font-size: 17px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  transition: all 0.2s;
  animation: pulse 2s infinite;
}
.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 140, 40, 0.3);
}

/* ── 动画 ── */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes breathe {
  from { opacity: 0.3; transform: scale(1); }
  to { opacity: 0.6; transform: scale(1.1); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
  50% { transform: scale(1.03); box-shadow: 0 4px 25px rgba(200, 140, 40, 0.4); }
  100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
}
</style>
