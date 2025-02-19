import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendChatMessage } from '../api/chatService'
import { DEFAULT_MODEL } from '../api/config'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref([])
  const selectedModel = ref(DEFAULT_MODEL)
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
    console.log('当前所有消息:', messages.value)
  }

  const toggleMessageSelection = (messageId) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      message.selected = !message.selected
      console.log(`消息 ${messageId} 选择状态更改为:`, message.selected)
    }
  }

  const setModel = (model) => {
    selectedModel.value = model
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
      const apiMessages = messages.value
        .filter(msg => msg.text.trim() && msg.selected) // 只包含选中的非空消息
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))

      const requestData = {
        model: selectedModel.value,
        messages: apiMessages
      }

      console.log('准备发送到API的消息:', requestData)

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
    isLoading,
    error,
    // 方法
    sendMessage,
    setModel,
    clearError,
    toggleMessageSelection
  }
}) 