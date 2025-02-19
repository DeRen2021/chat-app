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
          Chat
        </button>
        <button 
          :class="['nav-link', { active: currentView === 'settings' }]"
          @click="currentView = 'settings'"
        >
          Settings
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
  position: relative;
}

.nav-bar {
  height: 60px;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(228, 228, 228, 0.5);
  display: flex;
  align-items: center;
  padding: 0 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.nav-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #1a73e8, #8ab4f8);
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 32px;
  height: 100%;
  margin: 0 auto;
}

.nav-link {
  height: 100%;
  padding: 0 24px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: #5f6368;
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
  transform-origin: center;
  animation: navIndicator 0.3s ease;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 60px);
}

@keyframes navIndicator {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
    height: 56px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    padding: 0 16px;
    font-size: 15px;
  }

  .main-content {
    padding: 12px;
    height: calc(100vh - 56px);
  }
}

/* 大屏幕优化 */
@media (min-width: 1920px) {
  .main-content {
    max-width: 1400px;
  }
}

/* 小屏幕优化 */
@media (max-width: 480px) {
  .nav-bar {
    padding: 0 12px;
  }

  .nav-links {
    gap: 8px;
  }

  .nav-link {
    padding: 0 12px;
    font-size: 14px;
  }

  .main-content {
    padding: 8px;
  }
}
</style> 