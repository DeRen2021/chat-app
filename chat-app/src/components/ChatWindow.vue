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
        正在思考...
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
}

.messages-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #fff;
  position: relative;
}

.input-container {
  flex-shrink: 0;
  border-top: 1px solid #e4e4e4;
  padding: 16px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

.error-icon {
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  color: #856404;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.loading-indicator {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #666;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background-color: #666;
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
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 