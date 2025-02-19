<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import { AudioRecorder } from '../utils/audioRecorder'
import { transcribeAudio } from '../api/speechService'

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
      placeholder="Type a message, press Enter to send, Shift+Enter for new line..."
      @input="handleInput"
      @keydown="handleKeydown"
      rows="1"
    ></textarea>
    <div class="button-group">
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
  align-items: flex-end;
  gap: 12px;
  background-color: white;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  margin: 0 16px;
}

.message-input:focus-within {
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.15);
  border-color: #1a73e8;
}

textarea {
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  background-color: #f8f9fa;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
  transition: background-color 0.3s ease;
}

textarea:focus {
  background-color: white;
}

textarea::placeholder {
  color: #9aa0a6;
}

textarea:disabled {
  background-color: #f1f3f4;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.record-button,
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.record-button {
  background-color: #f8f9fa;
  color: #5f6368;
  border: 1px solid #dadce0;
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
  background-color: #1a73e8;
  color: white;
  transform: scale(1);
  box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3);
}

.send-button:hover:not(:disabled) {
  background-color: #1557b0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(26, 115, 232, 0.4);
}

.send-button:disabled,
.record-button:disabled {
  background-color: #f1f3f4;
  color: #9aa0a6;
  cursor: not-allowed;
  border-color: #e8eaed;
  box-shadow: none;
  opacity: 0.7;
}

.send-icon,
.mic-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.record-button:hover:not(:disabled) .mic-icon,
.send-button:hover:not(:disabled) .send-icon {
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
  .send-button {
    width: 36px;
    height: 36px;
  }

  .send-icon,
  .mic-icon {
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
</style> 