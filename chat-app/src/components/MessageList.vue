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
    <div v-for="message in messages" 
         :key="message.id" 
         :class="['message-container', message.sender]">
      <label class="message-checkbox">
        <input 
          type="checkbox" 
          :checked="message.selected !== false"
          @change="emit('toggleMessage', message.id)"
        >
      </label>
      <div class="message">
        <MessageContent :content="message.text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.message-checkbox {
  padding-top: 10px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.message-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.message {
  padding: 10px;
  border-radius: 8px;
  max-width: calc(70% - 24px);
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
}

.user {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.bot {
  justify-content: flex-start;
}

.user .message {
  background-color: #007bff;
  color: white;
}

.user .message :deep(*) {
  color: white;
}

.bot .message {
  background-color: #e9ecef;
  color: black;
}

/* 覆盖代码块的样式 */
.user .message :deep(pre) {
  background-color: rgba(0, 0, 0, 0.3);
  text-align: left;
  direction: ltr;
}

.bot .message :deep(pre) {
  background-color: #1e1e1e;
  text-align: left;
}

.bot .message :deep(code) {
  color: #d4d4d4;
}

.user .message :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
}
</style> 