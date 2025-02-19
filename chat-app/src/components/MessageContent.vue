<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return '' // 使用默认的转义
  },
  breaks: true,
  linkify: true
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<template>
  <div class="message-content" v-html="renderedContent"></div>
</template>

<style scoped>
.message-content {
  width: 100%;
  text-align: left;
}

.message-content :deep(pre) {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.message-content :deep(code) {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  padding: 2px 4px;
  border-radius: 4px;
  color: inherit;
}

/* 行内代码样式 */
.message-content :deep(:not(pre) > code) {
  background-color: rgba(0, 0, 0, 0.1);
  color: inherit;
}

.message-content :deep(p) {
  margin: 8px 0;
  line-height: 1.5;
  color: inherit;
}

.message-content :deep(ul), .message-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
  color: inherit;
}

.message-content :deep(li) {
  margin: 4px 0;
  color: inherit;
}

.message-content :deep(blockquote) {
  margin: 8px 0;
  padding-left: 12px;
  border-left: 3px solid currentColor;
  opacity: 0.8;
}

/* 代码高亮主题自定义 */
.message-content :deep(.hljs) {
  color: #e9e9e9;
  background: transparent;
}

.message-content :deep(.hljs-keyword),
.message-content :deep(.hljs-selector-tag),
.message-content :deep(.hljs-title),
.message-content :deep(.hljs-section) {
  color: #569cd6;
}

.message-content :deep(.hljs-string),
.message-content :deep(.hljs-selector-attr),
.message-content :deep(.hljs-selector-pseudo) {
  color: #ce9178;
}

.message-content :deep(.hljs-attribute),
.message-content :deep(.hljs-name),
.message-content :deep(.hljs-type) {
  color: #4ec9b0;
}

.message-content :deep(.hljs-symbol),
.message-content :deep(.hljs-bullet),
.message-content :deep(.hljs-built_in),
.message-content :deep(.hljs-builtin-name),
.message-content :deep(.hljs-addition) {
  color: #dcdcaa;
}

.message-content :deep(.hljs-comment),
.message-content :deep(.hljs-quote),
.message-content :deep(.hljs-meta) {
  color: #6a9955;
}

.message-content :deep(.hljs-number) {
  color: #b5cea8;
}
</style> 