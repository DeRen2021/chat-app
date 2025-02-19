<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import ModelSelector from './ModelSelector.vue'

const chatStore = useChatStore()

const handleSendMessage = async (text) => {
  await chatStore.sendMessage(text)
}

const handleToggleMessage = (messageId) => {
  chatStore.toggleMessageSelection(messageId)
}

// 响应式布局
const chatWindow = ref(null)
const updateSize = () => {
  if (chatWindow.value) {
    const vh = window.innerHeight * 0.9 // 90% of viewport height
    const vw = Math.min(window.innerWidth * 0.9, 800) // 90% of viewport width, max 800px
    chatWindow.value.style.height = `${vh}px`
    chatWindow.value.style.width = `${vw}px`
  }
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <div class="chat-window" ref="chatWindow">
    <div class="chat-header">
      <ModelSelector
        v-model:modelId="chatStore.selectedModel"
        @update:modelId="chatStore.setModel"
      />
    </div>
    <div v-if="chatStore.error" class="error-message">
      {{ chatStore.error }}
      <button @click="chatStore.clearError" class="close-button">×</button>
    </div>
    <MessageList 
      :messages="chatStore.messages" 
      @toggle-message="handleToggleMessage"
    />
    <MessageInput 
      @send="handleSendMessage" 
      :disabled="chatStore.isLoading"
    />
    <div v-if="chatStore.isLoading" class="loading-indicator">
      正在思考...
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff4444;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.loading-indicator {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}
</style> 