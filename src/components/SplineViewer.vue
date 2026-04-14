<template>
  <div class="spline-container">
    <!-- Spline 官方提供的 Web Component -->
    <!-- url 为从外部传入的模型地址 -->
    <spline-viewer 
      :url="sceneUrl" 
      class="viewer"
      @load="handleLoad"
    ></spline-viewer>

    <!-- 加载过程中的遮罩层 -->
    <div v-if="isLoading" class="loading-tips">
      榫卯组件加载中，请稍候...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 接收父组件(App.vue)传进来的参数
const props = defineProps({
  sceneUrl: {
    type: String,
    required: true
  }
});

// 定义向外抛出的事件 (通报拼装成功)
const emit = defineEmits(['assemble-success']);

const isLoading = ref(true);

// 模型加载完成的回调
const handleLoad = () => {
    isLoading.value = false;
    console.log('3D引擎与资源加载完毕！');
};

onMounted(() => {
    // 监听来自 Spline 抛出的自定义事件。
    // 你需要在 Spline 编辑器选中榫卯模型，添加 "Events" 模块中向外发送一个事件。
    window.addEventListener('spline-custom-event', (e) => {
        // e.detail.name 是你自己在 Spline 绑定时所设定的事件名称 (例如设为 success)
        if (e.detail?.name === 'success') {
            console.log('检测到拼装动作成功!');
            emit('assemble-success'); // 通知 App.vue 
        }
    });
});
</script>

<style scoped>
.spline-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; 
  background-color: #f1ebd8; /* 默认古风底色，以防 3D 未加载出来时黑屏 */
}

.viewer {
  width: 100%;
  height: 100%;
}

.loading-tips {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #5c3a21;
  z-index: 2;
  font-family: "楷体", serif;
  pointer-events: none; /* 让加载文字不阻挡鼠标事件 */
}
</style>
