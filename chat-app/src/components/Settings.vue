<script setup>
import { ref, inject } from 'vue'
import { useChatStore } from '../stores/chat'
import ModelSelector from './ModelSelector.vue'

const chatStore = useChatStore()
const isEditing = ref(false)
const tempSystemPrompt = ref(chatStore.systemPrompt)
const currentView = inject('currentView')

const startEditing = () => {
  isEditing.value = true
  tempSystemPrompt.value = chatStore.systemPrompt
}

const saveSystemPrompt = () => {
  chatStore.setSystemPrompt(tempSystemPrompt.value)
  isEditing.value = false
}

const cancelEditing = () => {
  tempSystemPrompt.value = chatStore.systemPrompt
  isEditing.value = false
}

const navigateToChat = () => {
  if (currentView) {
    currentView.value = 'chat'
  }
}
</script>

<template>
  <div class="settings-panel">
    <button class="back-button" @click="navigateToChat">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="back-icon">
        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
      </svg>
      Back to Chat
    </button>
    
    <h2>Settings</h2>
    
    <div class="settings-section">
      <h3>Model Selection</h3>
      <ModelSelector
        v-model:modelId="chatStore.selectedModel"
        @update:modelId="chatStore.setModel"
      />
    </div>

    <div class="settings-section">
      <div class="section-header">
        <h3>System Prompt</h3>
        <div class="action-buttons" v-if="!isEditing">
          <button class="edit-button" @click="startEditing">
            Edit
          </button>
        </div>
      </div>

      <div v-if="isEditing" class="edit-mode">
        <textarea
          v-model="tempSystemPrompt"
          placeholder="Enter system prompt..."
          rows="4"
          class="system-prompt"
        ></textarea>
        <div class="button-group">
          <button class="cancel-button" @click="cancelEditing">
            Cancel
          </button>
          <button class="save-button" @click="saveSystemPrompt">
            Save
          </button>
        </div>
      </div>
      <div v-else class="view-mode">
        <div class="prompt-display" v-if="chatStore.systemPrompt">
          {{ chatStore.systemPrompt }}
        </div>
        <div class="prompt-placeholder" v-else>
          No system prompt set
        </div>
      </div>
      <p class="hint">System prompt affects AI's behavior and response style</p>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.25rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

h2 {
  color: #343541;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.settings-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  color: #343541;
  font-size: 1.125rem;
  margin: 0;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.625rem;
}

.edit-button, .save-button, .cancel-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button {
  background-color: transparent;
  color: #1a73e8;
  border: 1px solid #1a73e8;
}

.edit-button:hover {
  background-color: rgba(26, 115, 232, 0.05);
}

.save-button {
  background-color: #1a73e8;
  color: white;
  border: none;
}

.save-button:hover {
  background-color: #1557b0;
}

.cancel-button {
  background-color: transparent;
  color: #6e6e80;
  border: 1px solid #6e6e80;
}

.cancel-button:hover {
  background-color: rgba(110, 110, 128, 0.05);
}

.button-group {
  display: flex;
  gap: 0.625rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
}

.system-prompt {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 0.625rem;
  min-height: 6.25rem;
  font-family: inherit;
}

.system-prompt:focus {
  border-color: #1a73e8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.25);
}

.view-mode {
  background-color: #f7f7f8;
  border-radius: 0.375rem;
  padding: 0.75rem;
  min-height: 3.75rem;
}

.prompt-display {
  white-space: pre-wrap;
  word-break: break-word;
  color: #343541;
  font-size: 0.875rem;
}

.prompt-placeholder {
  color: #6e6e80;
  font-style: italic;
  font-size: 0.875rem;
}

.hint {
  color: #6e6e80;
  font-size: 0.75rem;
  margin-top: 0.625rem;
}

.edit-mode {
  margin-top: 0.625rem;
}

/* 返回聊天的按钮 */
.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.5rem;
  color: #6e6e80;
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.back-button:hover {
  color: #1a73e8;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .settings-panel {
    padding: 1rem 0.75rem;
  }
  
  .settings-section {
    padding: 1rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  h3 {
    font-size: 1rem;
  }
}
</style> 