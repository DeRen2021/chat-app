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
  linkify: true,
  typographer: true // 启用排版功能
})

// 优化链接处理
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const hrefIndex = token.attrIndex('href')
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1]
    // 添加target和rel属性
    token.attrPush(['target', '_blank'])
    token.attrPush(['rel', 'noopener noreferrer'])
    // 添加一个标记类，用于样式化
    token.attrPush(['class', 'md-link'])
  }
  return self.renderToken(tokens, idx, options)
}

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
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 添加复制代码按钮的样式占位 */
.message-content :deep(pre)::before {
  content: attr(data-language);
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #888;
  background-color: rgba(0,0,0,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
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
  background-color: rgba(0, 0, 0, 0.07);
  color: #e03e3e;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  white-space: nowrap;
}

.message-content :deep(p) {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: inherit;
}

.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4),
.message-content :deep(h5),
.message-content :deep(h6) {
  margin: 1.5rem 0 0.75rem;
  line-height: 1.3;
  font-weight: 600;
  color: inherit;
}

.message-content :deep(h1) {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
}

.message-content :deep(h2) {
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.3rem;
}

.message-content :deep(h3) {
  font-size: 1.15rem;
}

.message-content :deep(h4) {
  font-size: 1.05rem;
}

.message-content :deep(ul), .message-content :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: inherit;
}

.message-content :deep(li) {
  margin: 0.375rem 0;
  color: inherit;
  line-height: 1.6;
}

.message-content :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid #1a73e8;
  background-color: rgba(26, 115, 232, 0.05);
  border-radius: 0.25rem;
  font-style: italic;
  color: inherit;
}

.message-content :deep(blockquote p) {
  margin: 0.5rem 0;
}

/* 表格样式 */
.message-content :deep(table) {
  border-collapse: collapse;
  margin: 1rem 0;
  width: 100%;
  overflow-x: auto;
  display: block;
}

.message-content :deep(th),
.message-content :deep(td) {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.6rem 1rem;
  text-align: left;
}

.message-content :deep(th) {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.message-content :deep(tr:nth-child(even)) {
  background-color: rgba(0, 0, 0, 0.02);
}

/* 链接样式 */
.message-content :deep(a) {
  color: #1a73e8;
  text-decoration: none;
  border-bottom: 1px solid rgba(26, 115, 232, 0.3);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.message-content :deep(a:hover) {
  color: #1557b0;
  border-bottom-color: #1557b0;
}

/* 水平线样式 */
.message-content :deep(hr) {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 1.5rem 0;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .message-content :deep(pre) {
    padding: 0.75rem;
    margin: 0.75rem 0;
  }
  
  .message-content :deep(blockquote) {
    padding: 0.375rem 0.75rem;
  }
  
  .message-content :deep(h1) {
    font-size: 1.3rem;
  }
  
  .message-content :deep(h2) {
    font-size: 1.2rem;
  }
  
  .message-content :deep(table) {
    font-size: 0.875rem;
  }
  
  .message-content :deep(th),
  .message-content :deep(td) {
    padding: 0.5rem 0.75rem;
  }
}
</style> 