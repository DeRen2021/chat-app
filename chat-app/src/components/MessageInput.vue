<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send'])
const message = ref('')

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
  }
}
</script>

<template>
  <div class="message-input">
    <input 
      v-model="message" 
      @keyup.enter="sendMessage"
      placeholder="输入消息..."
    />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  padding: 20px;
  gap: 10px;
  border-top: 1px solid #ddd;
}

.message-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.message-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.message-input button:hover {
  background-color: #0056b3;
}
</style> 