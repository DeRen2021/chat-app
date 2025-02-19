<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])
const messageText = ref('')
const textareaRef = ref(null)

const adjustTextareaHeight = async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    const scrollHeight = textareaRef.value.scrollHeight
    textareaRef.value.style.height = `${Math.min(scrollHeight, 200)}px`
  }
}

const handleInput = () => {
  adjustTextareaHeight()
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = () => {
  const text = messageText.value.trim()
  if (text && !props.disabled) {
    emit('send', text)
    messageText.value = ''
    adjustTextareaHeight()
  }
}
</script>

<template>
  <div class="message-input">
    <textarea
      ref="textareaRef"
      v-model="messageText"
      :disabled="disabled"
      placeholder="输入消息，按Enter发送，Shift+Enter换行..."
      @input="handleInput"
      @keydown="handleKeydown"
      rows="1"
    ></textarea>
    <button 
      class="send-button" 
      :disabled="disabled || !messageText.trim()"
      @click="sendMessage"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="send-icon">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background-color: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.message-input:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

textarea {
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
}

textarea::placeholder {
  color: #999;
}

textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.send-icon {
  width: 20px;
  height: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-input {
    padding: 6px;
    gap: 8px;
  }

  textarea {
    padding: 6px 10px;
    font-size: 16px; /* 防止iOS自动缩放 */
  }

  .send-button {
    width: 32px;
    height: 32px;
  }

  .send-icon {
    width: 18px;
    height: 18px;
  }
}
</style> 