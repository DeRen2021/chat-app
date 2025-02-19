import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendChatMessage } from '../api/chatService'
import { DEFAULT_MODEL } from '../api/config'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref([])
  const selectedModel = ref(DEFAULT_MODEL)
  const systemPrompt = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // 操作方法
  const addMessage = (message) => {
    const newMessage = {
      id: messages.value.length + 1,
      ...message,
      selected: true, // 默认选中
      timestamp: new Date().toISOString()
    }
    messages.value.push(newMessage)
    
    // 优化日志输出
    console.group('聊天历史更新')
    if (systemPrompt.value) {
      console.log('系统提示词:', systemPrompt.value)
    }
    console.log('所有消息:')
    messages.value.forEach(msg => {
      console.log(`[${msg.sender}]: ${msg.text}${msg.selected ? '' : ' (未选中)'}`)
    })
    console.groupEnd()
  }

  const toggleMessageSelection = (messageId) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      message.selected = !message.selected
      // 当消息选择状态改变时也更新日志
      console.group('消息选择状态更新')
      console.log(`消息 ${messageId} "${message.text.slice(0, 30)}..." 的选择状态更改为: ${message.selected}`)
      console.log('当前选中的消息:')
      messages.value
        .filter(msg => msg.selected)
        .forEach(msg => {
          console.log(`[${msg.sender}]: ${msg.text}`)
        })
      console.groupEnd()
    }
  }

  const setModel = (model) => {
    selectedModel.value = model
    console.log('模型已切换为:', model)
  }

  const setSystemPrompt = (prompt) => {
    systemPrompt.value = prompt
    console.log('系统提示词已更新为:', prompt || '(空)')
  }

  const clearError = () => {
    error.value = null
  }

  // API相关方法
  const sendMessage = async (text) => {
    try {
      isLoading.value = true
      error.value = null

      // 添加用户消息
      addMessage({
        text,
        sender: 'user'
      })

      // 准备发送给API的消息 - 只保留必要的字段和选中的消息
      const apiMessages = []

      // 如果有系统提示词，添加到消息开头
      if (systemPrompt.value.trim()) {
        apiMessages.push({
          role: 'system',
          content: systemPrompt.value
        })
      }

      // 添加选中的聊天记录
      apiMessages.push(...messages.value
        .filter(msg => msg.text.trim() && msg.selected)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })))

      const requestData = {
        model: selectedModel.value,
        messages: apiMessages
      }

      console.group('发送API请求')
      console.log('当前模型:', selectedModel.value)
      console.log('系统提示词:', systemPrompt.value || '(无)')
      console.log('发送的消息:', apiMessages)
      console.groupEnd()

      // 发送请求
      const response = await sendChatMessage(requestData)

      if (response.isError) {
        throw new Error(response.errorMessage)
      }

      // 添加AI响应
      addMessage({
        text: response.text,
        sender: 'bot'
      })
    } catch (e) {
      error.value = e.message
      console.error('发送消息失败:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    messages,
    selectedModel,
    systemPrompt,
    isLoading,
    error,
    // 方法
    sendMessage,
    setModel,
    setSystemPrompt,
    clearError,
    toggleMessageSelection
  }
}) 