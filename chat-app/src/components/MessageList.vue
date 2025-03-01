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

// 格式化时间显示
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// 格式化完整日期时间
const formatFullDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
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

// 显示/隐藏完整时间戳的状态
const showFullTimeMap = ref({});

// 切换显示完整时间戳
const toggleFullTime = (messageId) => {
  showFullTimeMap.value[messageId] = !showFullTimeMap.value[messageId];
}

// 判断是否显示完整时间戳
const isFullTimeVisible = (messageId) => {
  return !!showFullTimeMap.value[messageId];
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
        <div class="message-time" @click="toggleFullTime(message.id)">
          <span v-if="isFullTimeVisible(message.id)" class="full-datetime">
            {{ formatFullDateTime(message.timestamp) }}
          </span>
          <span v-else class="short-time">
            {{ formatMessageTime(message.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  min-height: 100%;
}

.message-container {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  animation: fadeIn 0.3s ease;
  position: relative;
  isolation: isolate;
  border-bottom: none;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  width: auto; /* Allow container to size to content */
  max-width: 75%; /* Limit width */
}

.message-container:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.message-container.user {
  background-color: rgba(236, 242, 251, 0.8);
  border-right: 3px solid #1a73e8;
  flex-direction: row-reverse; /* Reverse order for user messages */
  align-self: flex-end; /* Align the container to the right edge */
  margin-left: auto; /* Push to right */
}

.message-container.bot {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-left: 3px solid #34a853;
  align-self: flex-start; /* Align the container to the left edge */
}

.message-container.system {
  background-color: #f8f9fa;
  border-left: 3px solid #fbbc05;
  align-self: center; /* Center system messages */
  max-width: 90%;
  text-align: center;
}

.message-container.user:hover {
  background-color: rgba(230, 238, 250, 0.9);
}

.message-container.bot:hover {
  background-color: rgba(248, 249, 250, 0.8);
}

.message-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  padding: 0;
  position: relative;
  line-height: 1.6;
  overflow: hidden;
  word-wrap: break-word;
  hyphens: auto;
  background-color: transparent;
  font-size: 0.95rem;
}

/* Checkbox styles */
.message-checkbox {
  display: block;
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-top: 0.25rem;
  opacity: 0.3;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.message-container:hover .message-checkbox {
  opacity: 0.7;
}

.message-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.25rem;
  width: 1.25rem;
  background-color: #eee;
  border-radius: 0.25rem;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.message-checkbox:hover input ~ .checkmark {
  background-color: #ddd;
}

.message-checkbox input:checked ~ .checkmark {
  background-color: #1a73e8;
  border-color: #1a73e8;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.message-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.message-checkbox .checkmark:after {
  left: 0.4375rem;
  top: 0.1875rem;
  width: 0.25rem;
  height: 0.625rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Time display */
.message-time {
  font-size: 0.75rem;
  color: #6e6e80;
  padding: 0;
  text-align: right;
  font-style: italic;
  cursor: pointer;
  transition: color 0.2s ease;
}

.message-time:hover {
  color: #1a73e8;
}

.user .message-checkbox {
  order: 2; /* Move to the right in flex-direction: row-reverse */
}

.full-datetime {
  display: inline-block;
  background-color: rgba(26, 115, 232, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  color: #1a73e8;
  font-style: normal;
}

/* 搜索源样式调整 */
.search-sources-container {
  margin-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 0.75rem;
}

.show-sources-btn,
.sources-toggle-btn {
  background: none;
  border: 1px solid #1a73e8;
  color: #1a73e8;
  font-size: 0.8125rem;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  border-radius: 1rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.show-sources-btn:hover,
.sources-toggle-btn:hover {
  background-color: rgba(26, 115, 232, 0.08);
  transform: translateY(-1px);
}

/* 媒体查询适配 */
@media (max-width: 768px) {
  .message-container {
    padding: 0.875rem 0.75rem;
    gap: 0.5rem;
  }
  
  .message-checkbox {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .checkmark {
    height: 1rem;
    width: 1rem;
  }
  
  .message-checkbox .checkmark:after {
    left: 0.375rem;
    top: 0.125rem;
    width: 0.1875rem;
    height: 0.5rem;
  }
}

/* 确保代码块正确显示 */
.bot .message :deep(pre) {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  margin: 0.875rem 0;
  border: none;
  overflow-x: auto;
  max-width: 100%;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bot .message :deep(code) {
  color: #e9e9e9;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.user .message {
  text-align: left; /* Keep text aligned left for readability */
  color: #202124;
}

.user .message :deep(*) {
  color: inherit;
}

/* 修改用户消息样式 */
.user {
  justify-content: flex-end;
}

.user .message-wrapper {
  margin-right: 0;
  margin-left: 0;
  max-width: 90%;
}

/* 修改AI消息样式 */
.bot .message-wrapper {
  max-width: 90%;
  margin-left: 0;
  margin-right: auto;
}

/* 系统消息样式 */
.system .message {
  background-color: transparent;
  color: #5f6368;
  border-radius: 0.25rem;
  padding: 0;
}

.consecutive-message {
  margin-top: 0;
  padding-top: 0.5rem;
  border-top: none;
}

.consecutive-message .message-time {
  display: none;
}

/* Code block styles optimization */
.user .message :deep(pre) {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  margin: 0.875rem 0;
  overflow-x: auto;
  max-width: 100%;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.user .message :deep(code) {
  color: #e9e9e9;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.user .message :deep(blockquote),
.bot .message :deep(blockquote) {
  border-left: 3px solid #1a73e8;
  background-color: rgba(26, 115, 232, 0.05);
  padding: 0.75rem 1rem;
  margin: 0.875rem 0;
  border-radius: 0.25rem;
}

.search-sources-list {
  margin-top: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.75rem;
  padding: 0.75rem;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.search-source-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
  min-height: 2.5rem;
  border: 1px solid transparent;
}

.search-source-item:last-child {
  margin-bottom: 0;
}

.search-source-item:hover {
  background-color: #ffffff;
  border-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.source-index {
  background-color: #1a73e8;
  color: white;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.source-url {
  color: #1a73e8;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  font-size: 0.875rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design - improved breakpoints */
/* Extra small devices (phones, 600px and down) */
@media (max-width: 600px) {
  .message-list {
    padding: 0;
    gap: 0.5rem;
  }

  .message-container {
    padding: 0.75rem 0.625rem;
    margin: 0 0.25rem;
  }

  .message-wrapper {
    max-width: 85%;
  }

  .user .message-wrapper {
    max-width: 85%;
  }

  .system .message-wrapper {
    max-width: 90%;
  }

  .consecutive-message {
    margin-top: 0;
  }

  .source-url {
    max-width: 12.5rem;
  }
}

/* Small to Medium devices (600px to 992px) */
@media (min-width: 601px) and (max-width: 992px) {
  .message-wrapper {
    max-width: 85%;
  }

  .user .message-wrapper {
    max-width: 85%;
  }
  
  .consecutive-message {
    margin-top: 0;
  }

  .source-url {
    max-width: 18.75rem;
  }
}

/* Larger screens */
@media (min-width: 1200px) {
  .message-list {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
  }

  .message-wrapper {
    max-width: 90%;
  }

  .user .message-wrapper {
    max-width: 90%;
  }

  .system .message-wrapper {
    max-width: 90%;
  }
}

/* Mac优化 - 针对问题截图中的情况 */
@media screen and (min-width: 1280px) and (min-height: 800px) and (-webkit-min-device-pixel-ratio: 2),
       screen and (min-width: 1280px) {
  .message-list {
    max-width: 100%;
    width: 100%;
    padding: 0;
    gap: 0.75rem;
  }
  
  .message-wrapper {
    max-width: 95%;
  }
  
  .user .message-wrapper {
    max-width: 95%;
  }
  
  .system .message-wrapper {
    max-width: 95%;
  }
  
  .message {
    line-height: 1.6;
  }
}

/* Extra large screens */
@media (min-width: 1800px) {
  .message-list {
    max-width: 100%;
    width: 100%;
    padding: 0;
    gap: 0.875rem;
  }

  .message-time {
    font-size: 0.8125rem;
  }

  .source-url {
    font-size: 0.9375rem;
  }
}

/* 超大显示器 */
@media screen and (min-width: 2560px) and (min-height: 1440px) {
  .message-list {
    max-width: 100%;
    width: 100%;
    padding: 0;
    gap: 1rem;
  }
  
  .message-wrapper {
    max-width: 95%;
  }
  
  .user .message-wrapper {
    max-width: 95%;
  }
  
  .system .message-wrapper {
    max-width: 95%;
  }

  .message {
    font-size: 1rem;
  }
}

/* Improve touch targets for mobile */
@media (pointer: coarse) {
  .show-sources-btn,
  .sources-toggle-btn {
    min-height: 2.5rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }

  .search-source-item {
    min-height: 3rem;
    padding: 0.75rem;
  }
  
  .source-index {
    width: 1.875rem;
    height: 1.875rem;
  }
  
  .message-checkbox {
    opacity: 0.7;
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .checkmark {
    height: 1.5rem;
    width: 1.5rem;
  }
  
  .message-checkbox .checkmark:after {
    left: 0.5rem;
    top: 0.25rem;
    width: 0.25rem;
    height: 0.625rem;
  }
}

/* Fix for Safari spacing issues */
@supports (-webkit-touch-callout: none) {
  .message {
    word-break: break-word;
  }
}
</style> 