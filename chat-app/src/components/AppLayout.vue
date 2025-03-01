<script setup>
// 注入currentView和switchView方法
import { inject } from 'vue'

const currentView = inject('currentView')
const switchView = inject('switchView')

// 切换到设置页面
const openSettings = () => {
  switchView('settings')
}

// 切换到聊天页面
const openChat = () => {
  switchView('chat')
}
</script>

<template>
  <div class="app-layout">
    <!-- 导航栏 -->
    <header class="nav-bar">
      <div class="nav-logo">
        <span class="logo-text" @click="openChat" role="button">ChatApp</span>
      </div>
      <div class="nav-actions">
        <!-- 设置按钮 -->
        <button 
          class="nav-button" 
          @click="openSettings"
          :class="{ active: currentView === 'settings' }"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
            <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
    
    <!-- 主要内容 -->
    <main class="main-content">
      <slot></slot>
    </main>
    
    <div class="footer">
      <p>© 2024 ChatApp. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f7f7f8;
  overflow: hidden;
}

.nav-bar {
  height: 3rem;
  flex-shrink: 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: relative;
  z-index: 30;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-weight: 600;
  font-size: 1.25rem;
  color: #343541;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo-text:hover {
  opacity: 0.8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.375rem;
  border: none;
  background-color: transparent;
  color: #6e6e80;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.nav-button:hover {
  background-color: #f1f1f3;
  color: #343541;
}

.nav-button.active {
  background-color: #f1f1f3;
  color: #1a73e8;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 0;
  width: 100%;
  max-width: 100%;
}

/* 移动设备响应式设计 */
@media (max-width: 768px) {
  .nav-bar {
    height: 2.5rem;
  }
  
  .main-content {
    padding: 0;
    height: calc(100vh - 2.5rem);
  }

  .nav-button {
    width: 2rem;
    height: 2rem;
  }

  .nav-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}

/* 修改底部版权信息样式，类似ChatGPT */
.footer {
  text-align: center;
  font-size: 0.75rem;
  color: #6e6e80;
  padding: 0.5rem;
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 10;
  pointer-events: none;
  display: none; /* 默认隐藏，只在大屏幕上显示 */
}

@media (min-width: 1280px) {
  .footer {
    display: block;
  }
}
</style> 