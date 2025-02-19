<script setup>
import { ref } from 'vue'

const currentView = ref('chat') // 'chat' or 'settings'
</script>

<template>
  <div class="app-container">
    <nav class="nav-bar">
      <div class="nav-links">
        <button 
          :class="['nav-link', { active: currentView === 'chat' }]"
          @click="currentView = 'chat'"
        >
          聊天
        </button>
        <button 
          :class="['nav-link', { active: currentView === 'settings' }]"
          @click="currentView = 'settings'"
        >
          设置
        </button>
      </div>
    </nav>

    <main class="main-content">
      <slot :current-view="currentView"></slot>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: hidden;
}

.nav-bar {
  height: 48px;
  flex-shrink: 0;
  background-color: white;
  border-bottom: 1px solid #e4e4e4;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nav-links {
  display: flex;
  gap: 24px;
  height: 100%;
}

.nav-link {
  height: 100%;
  padding: 0 12px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #1a73e8;
}

.nav-link.active {
  color: #1a73e8;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1a73e8;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
</style> 