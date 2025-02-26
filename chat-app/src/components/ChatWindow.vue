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
    <!-- 错误提示 -->
    <div v-if="chatStore.error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ chatStore.error }}
      <button @click="chatStore.clearError" class="close-button">×</button>
    </div>

    <!-- 消息列表区域 -->
    <div class="messages-container" ref="messageContainer">
      <MessageList 
        :messages="chatStore.messages" 
        @toggle-message="handleToggleMessage"
      />
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div v-if="chatStore.isLoading" class="loading-indicator">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {{ chatStore.isSearchingWeb ? 'searching...' : 'thinking...' }}
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
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(228, 228, 228, 0.6);
}

.messages-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #fff;
  position: relative;
  padding: 20px 0;
  background-image: 
    radial-gradient(circle at 100% 100%, rgba(26, 115, 232, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(26, 115, 232, 0.03) 0%, transparent 50%);
}

.messages-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 1;
}

.messages-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 1;
}

.input-container {
  flex-shrink: 0;
  border-top: 1px solid rgba(228, 228, 228, 0.6);
  padding: 20px 0;
  background-color: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 2;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
}

.error-message {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(254, 247, 231, 0.95);
  color: #b45309;
  border: 1px solid #fde68a;
  padding: 12px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
  font-size: 14px;
  max-width: calc(100% - 48px);
}

.error-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.close-button {
  background: none;
  border: none;
  color: #b45309;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.7;
  transition: opacity 0.2s;
  margin-left: auto;
}

.close-button:hover {
  opacity: 1;
}

.loading-indicator {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  color: #5f6368;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(232, 234, 237, 0.8);
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background-color: #5f6368;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

@keyframes slideDown {
  from { 
    transform: translate(-50%, -20px); 
    opacity: 0; 
  }
  to { 
    transform: translate(-50%, 0); 
    opacity: 1; 
  }
}

@keyframes slideUp {
  from { 
    transform: translate(-50%, 20px); 
    opacity: 0; 
  }
  to { 
    transform: translate(-50%, 0); 
    opacity: 1; 
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(218, 220, 224, 0.6);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(189, 193, 198, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    border-radius: 16px;
  }

  .messages-container {
    padding: 16px 0;
  }

  .input-container {
    padding: 16px 0;
  }

  .error-message {
    top: 16px;
    padding: 10px 20px;
    max-width: calc(100% - 32px);
  }
}

/* 大屏幕优化 */
@media (min-width: 1920px) {
  .chat-container {
    max-width: 1400px;
    margin: 0 auto;
  }
}
</style> 