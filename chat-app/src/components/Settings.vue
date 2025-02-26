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

const toggleAutoWebSearch = () => {
  chatStore.setAutoWebSearch(!chatStore.autoWebSearchEnabled)
}
</script>

<template>
  <div class="settings-panel">
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
          <button class="save-button" @click="saveSystemPrompt">
            Save
          </button>
          <button class="cancel-button" @click="cancelEditing">
            Cancel
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

    <div class="settings-section">
      <div class="section-header">
        <h3>Web Search</h3>
        <div class="toggle-switch">
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="chatStore.autoWebSearchEnabled"
              @change="toggleAutoWebSearch"
            >
            <span class="slider round"></span>
          </label>
          <span class="toggle-label">{{ chatStore.autoWebSearchEnabled ? 'Enabled' : 'Disabled' }}</span>
        </div>
      </div>
      <p class="hint">When enabled, AI will automatically search the web for relevant information to provide more comprehensive answers</p>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

h3 {
  color: #666;
  font-size: 18px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-button, .save-button, .cancel-button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #f8f9fa;
  color: #007bff;
  border: 1px solid #007bff;
}

.edit-button:hover {
  background-color: #e2e6ea;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #6c757d;
}

.cancel-button:hover {
  background-color: #e2e6ea;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
}

.system-prompt {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 10px;
  min-height: 100px;
}

.system-prompt:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.view-mode {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  min-height: 60px;
}

.prompt-display {
  white-space: pre-wrap;
  word-break: break-word;
  color: #333;
}

.prompt-placeholder {
  color: #6c757d;
  font-style: italic;
}

.hint {
  color: #666;
  font-size: 12px;
  margin-top: 10px;
}

.edit-mode {
  margin-top: 10px;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.search-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #0056b3;
}

.search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.search-error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #007bff;
}

input:focus + .slider {
  box-shadow: 0 0 1px #007bff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.toggle-label {
  font-size: 14px;
  color: #666;
}
</style> 