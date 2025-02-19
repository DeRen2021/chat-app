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
  }
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
}

.message-content :deep(pre) {
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 1em;
  margin: 0.5em 0;
  overflow-x: auto;
}

.message-content :deep(code) {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
}

.message-content :deep(p) {
  margin: 0.5em 0;
}

.message-content :deep(ul), .message-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message-content :deep(blockquote) {
  margin: 0.5em 0;
  padding-left: 1em;
  border-left: 3px solid #ddd;
  color: #666;
}
</style> 