<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'

const chatStore = useChatStore()
const messageContainer = ref(null)

const handleSendMessage = async (text) => {
  await chatStore.sendMessage(text)
  scrollToBottom()
}

const handleToggleMessage = (messageId) => {
  chatStore.toggleMessageSelection(messageId)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-container">
    <!-- Web search indicator now floats at the top right corner -->
    <div v-if="chatStore.autoWebSearchEnabled" class="web-search-indicator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="web-search-icon">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
      </svg>
      <span>Web Search Enabled</span>
    </div>

    <!-- Error message -->
    <div v-if="chatStore.error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ chatStore.error }}
      <button @click="chatStore.clearError" class="close-button">×</button>
    </div>

    <!-- Message list area -->
    <div class="messages-container" ref="messageContainer">
      <MessageList 
        :messages="chatStore.messages" 
        @toggle-message="handleToggleMessage"
      />
    </div>

    <!-- Input area -->
    <div class="input-container">
      <div v-if="chatStore.isLoading" class="loading-indicator">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {{ chatStore.isSearchingWeb ? 'Searching the web...' : 'Thinking...' }}
      </div>
      <MessageInput 
        @send="handleSendMessage" 
        :disabled="chatStore.isLoading"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  overflow: hidden;
  border: none;
}

.web-search-indicator {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(26, 115, 232, 0.1);
  color: #1a73e8;
  border-radius: 1rem;
  font-size: 0.875rem;
  z-index: 10;
}

.web-search-icon {
  width: 1rem;
  height: 1rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(218, 220, 224, 0.6) transparent;
  padding: 1rem 1rem 100px; /* 为输入框留出足够空间 */
  scroll-behavior: smooth;
  background-color: #f9f9fa; /* 轻微的背景色，增强可见性 */
}

.messages-container::-webkit-scrollbar {
  width: 5px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(218, 220, 224, 0.6);
  border-radius: 3px;
}

.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.98);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 20;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(8px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); /* 添加阴影，增强可见性 */
}

.error-message {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(254, 247, 231, 0.95);
  color: #b45309;
  border: 1px solid #fde68a;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 100;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
  font-size: 0.875rem;
  max-width: calc(100% - 3rem);
  word-break: break-word;
}

.error-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.close-button {
  background: none;
  border: none;
  color: #b45309;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.3125rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  margin-left: auto;
  min-width: 2rem;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 1;
}

.loading-indicator {
  position: absolute;
  bottom: 85px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.98);
  color: #5f6368;
  padding: 0.5rem 1.5rem;
  border-radius: 1.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(232, 234, 237, 0.8);
  z-index: 21; /* 确保加载指示器在最上层 */
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
}

.typing-indicator span {
  width: 0.25rem;
  height: 0.25rem;
  background-color: #5f6368;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-0.375rem); }
}

@keyframes slideDown {
  from { 
    transform: translate(-50%, -1.25rem); 
    opacity: 0; 
  }
  to { 
    transform: translate(-50%, 0); 
    opacity: 1; 
  }
}

@keyframes slideUp {
  from { 
    transform: translate(-50%, 1.25rem); 
    opacity: 0; 
  }
  to { 
    transform: translate(-50%, 0); 
    opacity: 1; 
  }
}

/* Scrollbar styles */
.messages-container::-webkit-scrollbar {
  width: 0.375rem;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(218, 220, 224, 0.6);
  border-radius: 0.1875rem;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(189, 193, 198, 0.8);
}

/* Responsive design */
/* Extra small devices (phones, 600px and down) */
@media (max-width: 600px) {
  .chat-container {
    border-radius: 0.75rem;
  }

  .messages-container {
    padding: 0.75rem 0.75rem 100px;
  }

  .input-container {
    padding: 0.75rem 0;
  }

  .error-message {
    top: 0.75rem;
    padding: 0.5rem 0.75rem;
    max-width: calc(100% - 1.5rem);
    font-size: 0.8125rem;
  }

  .loading-indicator {
    bottom: 70px;
    padding: 0.375rem 1rem;
    font-size: 0.8125rem;
  }
}

/* Small devices (portrait tablets and large phones, 600px to 768px) */
@media (min-width: 601px) and (max-width: 768px) {
  .messages-container {
    padding: 1rem 0.875rem 100px;
  }

  .input-container {
    padding: 0.875rem 0;
  }
}

/* Medium devices (landscape tablets, 768px to 992px) */
@media (min-width: 769px) and (max-width: 992px) {
  .messages-container {
    padding: 1.25rem 1.25rem 120px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media (min-width: 993px) {
  .messages-container {
    padding: 1.5rem 1.5rem 120px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .chat-container {
    max-width: none;
    width: 100%;
    margin: 0;
  }
}

/* 针对macOS的特定优化 */
@media screen and (min-width: 1280px) and (min-height: 800px) and (-webkit-min-device-pixel-ratio: 2),
       screen and (min-width: 1280px) {
  .chat-container {
    max-width: none;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }
  
  .messages-container {
    min-height: 0;
    padding: 1.5rem 2rem 140px; /* 增加左右内边距和底部空间 */
    margin-bottom: 0;
  }

  .input-container {
    padding: 1rem 2rem; /* 增加左右内边距 */
  }
}

/* 超大屏幕Mac显示器 */
@media screen and (min-width: 2560px) and (min-height: 1440px) {
  .chat-container {
    max-width: none;
    width: 100%;
  }
  
  .messages-container {
    min-height: 70vh;
    padding: 2rem 3rem 160px; /* 更大的内边距 */
  }

  .input-container {
    padding: 1.25rem 3rem; /* 更大的内边距 */
  }
}
</style> 