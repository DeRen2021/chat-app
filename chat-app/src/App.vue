<script setup>
import ChatWindow from './components/ChatWindow.vue'
</script>

<template>
  <div class="chat-container">
    <ChatWindow />
  </div>
</template>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
