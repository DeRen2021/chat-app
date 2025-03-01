<script setup>
import { useChatStore } from '../stores/chat'
import ChatWindow from '../components/ChatWindow.vue'
import { onMounted, watchEffect } from 'vue'

// Import the chat store
const chatStore = useChatStore()

// Initialize with test messages for development
onMounted(() => {
  // Only add test messages if chat is empty
  if (chatStore.messages.length === 0) {
    // Add a welcome message
    chatStore.addMessage({
      text: "你好！我是你的智能助手。有什么我可以帮助你的吗？",
      sender: 'bot'
    })
    
    // Test messages to demonstrate message positioning
    chatStore.addMessage({
      text: "这是一条用户消息，应该显示在右侧。我想了解一下这个聊天应用的功能。",
      sender: 'user'
    })
    
    chatStore.addMessage({
      text: "当然可以！这是一个功能丰富的聊天应用，支持多种消息格式，包括：\n\n- Markdown格式文本\n- 代码高亮\n- 链接识别\n- 网络搜索集成",
      sender: 'bot'
    })
    
    chatStore.addMessage({
      text: "系统通知：当前在演示模式下运行。",
      sender: 'system'
    })
    
    chatStore.addMessage({
      text: "我能看到消息显示效果了，右侧显示我的消息，左侧显示机器人回复！",
      sender: 'user'
    })
    
    chatStore.addMessage({
      text: "```javascript\n// 这是一段代码示例\nfunction testFormat() {\n  console.log('代码高亮效果');\n  return true;\n}\n```",
      sender: 'bot'
    })
  }
})
</script>

<template>
  <div class="chat-view">
    <ChatWindow />
  </div>
</template>

<style scoped>
.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style> 