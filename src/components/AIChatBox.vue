<template>
  <div class="chat-container">
    <div class="chat-header">
      🤖 AI 鲁班
    </div>
    
    <!-- 历史对话记录区 -->
    <div class="chat-history" ref="historyRef">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message', msg.role === 'user' ? 'user-msg' : 'ai-msg']"
      >
        {{ msg.content }}
      </div>
      <!-- 发送请求后的等待加载状态 -->
      <div v-if="isTyping" class="message ai-msg typing">
        鲁班大师思考中...
      </div>
    </div>

    <!-- 用户输入区 -->
    <div class="chat-input-area">
      <input 
        v-model="inputText" 
        @keyup.enter="sendMessage"
        placeholder="请教关于古建筑的问题..." 
        class="input-box"
      />
      <button @click="sendMessage" class="send-btn" :disabled="isTyping">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// 初始提示语
const messages = ref([
  { role: 'ai', content: '年轻的工匠你好，我是 AI 鲁班。遇到拿捏不准的拼接，随时问我！' }
]);
const inputText = ref('');
const isTyping = ref(false);
const historyRef = ref(null);

// 核心网络请求函数：从 .env 文件读取配置，支持 DeepSeek / 通义千问 / OpenAI
const fetchAIResponse = async (userText) => {
  const API_KEY = import.meta.env.VITE_AI_API_KEY;
  const API_URL = import.meta.env.VITE_AI_API_URL;
  const MODEL   = import.meta.env.VITE_AI_MODEL || 'deepseek-chat';

  if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
    return '请先在项目根目录的 .env 文件中填入真实的 VITE_AI_API_KEY，然后重启开发服务器。';
  }

  // OpenAI 协议：role 只能是 system / user / assistant
  // 跳过第一条初始欢迎语（避免对话以 assistant 开头导致 400）
  const history = messages.value
    .filter((m, i) => !(i === 0 && m.role === 'ai'))  // 跳过欢迎语
    .slice(-10)  // 最多 10 条，节省 token
    .map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content
    }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一位名叫"鲁班"的古代木匠大师，精通中国古建筑与榫卯结构。' +
                     '回答请用古朴口吻，精简幽默，每次不超过80字。' +
                     '遇到与建筑无关的问题，请婉拒并引导回榫卯话题。'
          },
          ...history,
          { role: 'user', content: userText }
        ],
        temperature: 0.75
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // 提取 API 返回的真实错误信息
      const detail = err?.error?.message || err?.message || JSON.stringify(err);
      console.error('AI API 错误详情:', response.status, detail);
      return `接口错误 ${response.status}：${detail}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '老朽语塞，请再问一次。';
  } catch (error) {
    console.error('AI 接口网络异常:', error);
    return '老朽遇到些许风寒（网络异常），请稍后再试。';
  }
};

// 发送消息并渲染数据驱动视图
const sendMessage = async () => {
  if (!inputText.value.trim() || isTyping.value) return;
  
  const text = inputText.value.trim();
  // 1. 本地玩家消息压入数组，Vue 会自动驱动更新 UI
  messages.value.push({ role: 'user', content: text });
  inputText.value = '';
  isTyping.value = true;
  await scrollToBottom();
  
  // 2. 发起 API 网络请求
  const aiReply = await fetchAIResponse(text);
  
  // 3. AI 回复压入数组
  messages.value.push({ role: 'ai', content: aiReply });
  isTyping.value = false;
  await scrollToBottom();
};

// 工具函数：消息增多时，自动滚动到最底端最新消息
const scrollToBottom = async () => {
  await nextTick();
  if (historyRef.value) {
    historyRef.value.scrollTop = historyRef.value.scrollHeight;
  }
};
</script>

<style scoped>
.chat-container {
  width: 340px;
  height: 500px;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid #8b5a2b; /* 古建筑风格的深木色边框 */
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  /* 背景模糊特效 (玻璃拟态效果更现代高级) */
  backdrop-filter: blur(8px); 
}

.chat-header {
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #8b5a2b;
  color: #fff;
  font-weight: bold;
  font-family: "楷体", serif;
  font-size: 20px;
  border-radius: 8px 8px 0 0;
}

.chat-history {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.user-msg {
  align-self: flex-end;
  background: #e6eeb1; /* 抹茶古风绿 */
  color: #333;
}

.ai-msg {
  align-self: flex-start;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.typing {
  font-style: italic;
  color: #888;
  background: transparent;
  border: none;
}

.chat-input-area {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 10px 10px;
}

.input-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  transition: border 0.3s;
}
.input-box:focus {
  border-color: #8b5a2b;
}

.send-btn {
  margin-left: 10px;
  padding: 0 20px;
  background: #8b5a2b;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;
}

.send-btn:hover {
  opacity: 0.9;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
