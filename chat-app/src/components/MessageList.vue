<script setup>
import MessageContent from './MessageContent.vue'

defineProps({
  messages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggleMessage'])
</script>

<template>
  <div class="message-list">
    <div v-for="(message, index) in messages" 
         :key="message.id" 
         :class="['message-container', message.sender, {
           'first-message': index === 0,
           'consecutive-message': index > 0 && messages[index - 1].sender === message.sender
         }]">
      <label class="message-checkbox">
        <input 
          type="checkbox" 
          :checked="message.selected !== false"
          @change="emit('toggleMessage', message.id)"
        >
        <span class="checkmark"></span>
      </label>
      <div class="message-wrapper">
        <div class="message">
          <MessageContent :content="message.text" />
        </div>
        <div class="message-time">
          {{ new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  min-height: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  animation: fadeIn 0.3s ease;
}

.message-wrapper {
  flex: 1;
  max-width: calc(65% - 40px);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-checkbox {
  padding-top: 10px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.message-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.message-checkbox:hover input ~ .checkmark {
  border-color: #1a73e8;
}

.message-checkbox input:checked ~ .checkmark {
  background-color: #1a73e8;
  border-color: #1a73e8;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.message-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.message {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.user {
  flex-direction: row-reverse;
}

.user .message-wrapper {
  align-items: flex-end;
}

.user .message {
  background-color: #1a73e8;
  color: white;
  border-bottom-right-radius: 4px;
}

.user .message :deep(*) {
  color: white;
}

.bot .message {
  background-color: #f1f3f4;
  color: #202124;
  border-bottom-left-radius: 4px;
}

.consecutive-message {
  margin-top: -8px;
}

.consecutive-message .message-time {
  display: none;
}

/* 代码块样式优化 */
.user .message :deep(pre) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.bot .message :deep(pre) {
  background-color: #282a36;
  border-radius: 8px;
}

.bot .message :deep(code) {
  color: #f8f8f2;
}

.user .message :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-list {
    padding: 16px;
    gap: 12px;
  }

  .message-wrapper {
    max-width: calc(80% - 30px);
  }

  .message {
    padding: 10px 12px;
  }

  .message-checkbox {
    padding-top: 8px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 