<script setup>
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'
import ModelSelector from './ModelSelector.vue'

const chatStore = useChatStore()
const isEditing = ref(false)
const tempSystemPrompt = ref(chatStore.systemPrompt)

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
</style> 