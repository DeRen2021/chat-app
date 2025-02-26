<script setup>
import MessageContent from './MessageContent.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggleMessage'])

// Calculate visible messages
const visibleMessages = computed(() => {
  return props.messages.filter(msg => !msg.hidden);
});

// Determine if message is consecutive, considering hidden messages
const getConsecutiveMessage = (currentMessage, index) => {
  if (index === 0) return false;
  return visibleMessages.value[index - 1].sender === currentMessage.sender;
}

// Function to open links
const openUrl = (url) => {
  window.open(url, '_blank');
}

// Track the display status of source URLs for each message
const showSourcesMap = ref({});

// Toggle source URL display status
const toggleSources = (messageId) => {
  showSourcesMap.value[messageId] = !showSourcesMap.value[messageId];
}

// Determine if sources should be visible
const isSourceVisible = (messageId) => {
  return !!showSourcesMap.value[messageId]; // Default is false, only show when explicitly set to true
}
</script>

<template>
  <div class="message-list">
    <div v-for="(message, index) in visibleMessages" 
         :key="message.id" 
         :class="['message-container', message.sender, {
           'first-message': index === 0,
           'consecutive-message': getConsecutiveMessage(message, index)
         }]">
      <label class="message-checkbox">
        <input 
          type="checkbox" 
          :checked="message.selected !== false"
          @change="emit('toggleMessage', message.id)"
        >
        <span class="checkmark"></span>
      </label>
      <div class="message-wrapper">
        <div class="message">
          <MessageContent :content="message.text" />
          
          <!-- If this is an AI message with sources, display source-related UI -->
          <div v-if="message.sender === 'bot' && message.searchSources && message.searchSources.length > 0" 
               class="search-sources-container">
            
            <!-- Source list, only shown after clicking "View Sources" -->
            <div v-if="isSourceVisible(message.id)">
              <button 
                class="sources-toggle-btn" 
                @click="toggleSources(message.id)"
              >
                Hide Sources
              </button>
              
              <div class="search-sources-list">
                <div 
                  v-for="source in message.searchSources" 
                  :key="source.index" 
                  class="search-source-item"
                  @click="openUrl(source.url)"
                >
                  <span class="source-index">{{ source.index }}</span>
                  <span class="source-url">{{ source.url }}</span>
                </div>
              </div>
            </div>
            
            <!-- By default, only show the "View Sources" button -->
            <div v-else>
              <button 
                class="show-sources-btn" 
                @click="toggleSources(message.id)"
              >
                View Sources
              </button>
            </div>
          </div>
        </div>
        <div class="message-time">
          {{ new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  min-height: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: static;
  overflow: visible;
}

.message-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  animation: fadeIn 0.3s ease;
  position: relative;
  isolation: isolate;
}

.message-wrapper {
  flex: 1;
  max-width: calc(65% - 40px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: static;
}

.message-checkbox {
  padding-top: 12px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-container:hover .message-checkbox {
  opacity: 1;
}

.message-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 2px solid #dadce0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.message-checkbox:hover input ~ .checkmark {
  border-color: #1a73e8;
  background-color: #f8f9fa;
}

.message-checkbox input:checked ~ .checkmark {
  background-color: #1a73e8;
  border-color: #1a73e8;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.message-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.message {
  padding: 14px 18px;
  border-radius: 18px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  overflow: hidden;
}

.message-time {
  font-size: 12px;
  color: #9aa0a6;
  margin-top: 4px;
  padding: 0 4px;
}

.user {
  flex-direction: row-reverse;
}

.user .message-wrapper {
  align-items: flex-end;
}

.user .message {
  background-color: #1a73e8;
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 6px rgba(26, 115, 232, 0.2);
}

.user .message :deep(*) {
  color: white;
}

.bot .message {
  background-color: #f8f9fa;
  color: #202124;
  border-bottom-left-radius: 4px;
  border: 1px solid #e8eaed;
}

.system .message {
  background-color: #f1f8e9;
  color: #33691e;
  border-bottom-left-radius: 4px;
  border: 1px solid #c5e1a5;
}

.system .message-wrapper {
  max-width: calc(80% - 40px);
}

.consecutive-message {
  margin-top: -12px;
}

.consecutive-message .message-time {
  display: none;
}

/* 代码块样式优化 */
.user .message :deep(pre) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 12px 0;
}

.bot .message :deep(pre) {
  background-color: #282a36;
  border-radius: 12px;
  margin: 12px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.bot .message :deep(code) {
  color: #f8f8f2;
}

.user .message :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
  margin: 12px 0;
}

.bot .message :deep(blockquote) {
  border-left: 3px solid #1a73e8;
  background-color: rgba(26, 115, 232, 0.05);
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-list {
    padding: 16px;
    gap: 16px;
  }

  .message-wrapper {
    max-width: calc(80% - 30px);
  }

  .message {
    padding: 12px 16px;
  }

  .message-checkbox {
    padding-top: 10px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-sources-container {
  margin-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 12px;
  text-align: right;
}

.sources-toggle-btn {
  display: inline-block;
  background: none;
  border: none;
  color: #5f6368;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sources-toggle-btn:hover {
  background-color: #f1f3f4;
}

.show-sources-btn {
  display: inline-block;
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.show-sources-btn:hover {
  background-color: #f1f3f4;
}

.search-sources-list {
  margin-top: 10px;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 8px;
  text-align: left;
}

.search-source-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  margin-bottom: 2px;
}

.search-source-item:last-child {
  margin-bottom: 0;
}

.search-source-item:hover {
  background-color: #ffffff;
}

.source-index {
  background-color: #1a73e8;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.source-url {
  color: #1a73e8;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  font-size: 13px;
}
</style> 