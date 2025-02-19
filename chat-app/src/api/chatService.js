/*
This file store the function to send chat message to the API

*/


import { API_ENDPOINTS, DEFAULT_MODEL } from './config'

export async function sendChatMessage(requestData) {
  try {
    // 确保使用用户选择的模型，只有在未提供时才使用默认模型
    const { model = DEFAULT_MODEL, messages } = requestData
    const endpoint = API_ENDPOINTS[model]
    
    if (!endpoint) {
      throw new Error(`不支持的模型: ${model}`)
    }

    console.group('API请求详情')
    console.log('请求URL:', endpoint)
    console.log('请求体:', {
      model,
      messages,
      messageCount: messages.length
    })
    console.groupEnd()

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('API错误响应:', data)
      const errorMessage = data.detail?.[0]?.msg || data.detail || '请求失败'
      throw new Error(errorMessage)
    }

    console.log('API成功响应:', data)
    return {
      text: data.response,
      model: data.model_used,
      isError: false
    }
  } catch (error) {
    console.error('API调用错误:', error)
    return {
      text: '',
      isError: true,
      errorMessage: error.message
    }
  }
} 