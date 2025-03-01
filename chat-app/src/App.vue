<script setup>
import AppLayout from './components/AppLayout.vue'
import ChatWindow from './components/ChatWindow.vue'
import Settings from './components/Settings.vue'
import { ref, provide } from 'vue'

// 添加视图状态管理
const currentView = ref('chat') // 默认显示聊天页面
provide('currentView', currentView) // 提供给子组件使用

// 切换视图方法
const switchView = (view) => {
  currentView.value = view
}
provide('switchView', switchView)
</script>

<template>
  <AppLayout>
    <!-- 根据当前视图显示对应组件 -->
    <ChatWindow v-if="currentView === 'chat'" />
    <Settings v-else-if="currentView === 'settings'" />
  </AppLayout>
</template>

<style>
/* 全局样式 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f7f7f8;
  color: #343541;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(218, 220, 224, 0.6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(189, 193, 198, 0.8);
}
</style>
