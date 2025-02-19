<script setup>
import AppLayout from './components/AppLayout.vue'
import ChatWindow from './components/ChatWindow.vue'
import Settings from './components/Settings.vue'
</script>

<template>
  <AppLayout v-slot="{ currentView }">
    <ChatWindow v-if="currentView === 'chat'" />
    <Settings v-else-if="currentView === 'settings'" />
  </AppLayout>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
