<script setup>
import { ref, nextTick, onUnmounted, computed } from 'vue'
import { AudioRecorder } from '../utils/audioRecorder'
import { transcribeAudio } from '../api/speechService'
import { useChatStore } from '../stores/chat'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])
const messageText = ref('')
const textareaRef = ref(null)
const isRecording = ref(false)
const recorder = new AudioRecorder()
const chatStore = useChatStore()

// 计算属性用于显示当前网页搜索状态
const webSearchEnabled = computed(() => chatStore.autoWebSearchEnabled)

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

// 添加切换网页搜索功能的方法
const toggleWebSearch = () => {
  chatStore.setAutoWebSearch(!chatStore.autoWebSearchEnabled)
}

const toggleRecording = async () => {
  try {
    if (!isRecording.value) {
      await recorder.start()
      isRecording.value = true
    } else {
      const audioBlob = await recorder.stop()
      isRecording.value = false
      const transcription = await transcribeAudio(audioBlob)
      if (transcription) {
        messageText.value = transcription
        await adjustTextareaHeight()
      }
    }
  } catch (error) {
    console.error('录音错误:', error)
    isRecording.value = false
    alert(error.message || '录音出错，请重试')
  }
}

// 组件卸载时确保释放录音资源
onUnmounted(() => {
  if (isRecording.value) {
    recorder.releaseStream()
  }
})
</script>

<template>
  <div class="message-input">
    <textarea
      ref="textareaRef"
      v-model="messageText"
      :disabled="disabled"
      placeholder="Type message, press Enter to send, Shift+Enter for new line..."
      @input="handleInput"
      @keydown="handleKeydown"
      rows="1"
    ></textarea>
    <div class="button-group">
      <!-- 添加网页搜索切换按钮 -->
      <button 
        class="web-search-button" 
        :class="{ active: webSearchEnabled }"
        @click="toggleWebSearch"
        :disabled="disabled"
        type="button"
        :title="webSearchEnabled ? 'Web Search Enabled' : 'Web Search Disabled'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="web-search-icon">
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <button 
        class="record-button" 
        :class="{ recording: isRecording }"
        @click="toggleRecording"
        :disabled="disabled"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mic-icon">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
      </button>
      <button 
        class="send-button" 
        :disabled="disabled || !messageText.trim()"
        @click="sendMessage"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="send-icon">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 8px 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  position: relative;
  transition: border-color 0.2s;
}

.message-input:focus-within {
  border-color: #1a73e8;
}

textarea {
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
}

textarea::placeholder {
  color: #6e6e80;
}

textarea:disabled {
  background-color: #f1f3f4;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.record-button,
.send-button,
.web-search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0;
  flex-shrink: 0;
}

.record-button {
  background-color: #f8f9fa;
  color: #5f6368;
  border: 1px solid #dadce0;
}

.web-search-button {
  background-color: #f8f9fa;
  color: #5f6368;
  border: 1px solid #dadce0;
}

.web-search-button.active {
  background-color: #1a73e8;
  color: white;
  border: none;
}

.web-search-button:hover:not(:disabled) {
  background-color: #f1f3f4;
  border-color: #d2d5d9;
  transform: translateY(-1px);
}

.web-search-button.active:hover:not(:disabled) {
  background-color: #1557b0;
  border: none;
}

.web-search-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.record-button:hover:not(:disabled) {
  background-color: #f1f3f4;
  border-color: #d2d5d9;
  transform: translateY(-1px);
}

.record-button.recording {
  background-color: #d93025;
  color: white;
  border: none;
  animation: pulse 1.5s infinite;
}

.send-button {
  background-color: transparent;
  color: #1a73e8;
}

.send-button:hover:not(:disabled) {
  background-color: rgba(26, 115, 232, 0.1);
}

.send-button:disabled,
.record-button:disabled,
.web-search-button:disabled {
  background-color: #f1f3f4;
  color: #9aa0a6;
  cursor: not-allowed;
  border-color: #e8eaed;
  box-shadow: none;
  opacity: 0.7;
}

.send-icon,
.mic-icon,
.web-search-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.record-button:hover:not(:disabled) .mic-icon,
.send-button:hover:not(:disabled) .send-icon,
.web-search-button:hover:not(:disabled) .web-search-icon {
  transform: scale(1.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-input {
    margin: 0 8px;
    padding: 8px 12px;
  }

  textarea {
    padding: 6px 10px;
    font-size: 16px;
  }

  .record-button,
  .send-button,
  .web-search-button {
    width: 36px;
    height: 36px;
  }

  .send-icon,
  .mic-icon,
  .web-search-icon {
    width: 18px;
    height: 18px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(217, 48, 37, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(217, 48, 37, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(217, 48, 37, 0);
  }
}

/* 减少整体input容器的内边距 */
@media screen and (min-width: 1280px) {
  .input-container {
    padding: 0.5rem;
  }
  
  .message-input {
    margin: 0 4px;
  }
}
</style> 