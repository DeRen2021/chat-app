/*
This file store the function to send chat message to the API
*/

import { API_ENDPOINTS, DEFAULT_MODEL, TEST } from './config'

export async function sendChatMessage(requestData) {
  try {
    // Ensure user-selected model is used, only use default model when not provided
    const { model = DEFAULT_MODEL, messages } = requestData
    const endpoint = API_ENDPOINTS[model]
    
    if (!endpoint) {
      throw new Error(`Unsupported model: ${model}`)
    }

    if (TEST) {
      console.group('API Request Details')
      console.log('Request URL:', endpoint)
      console.log('Request Body:', {
        model,
        messages,
        messageCount: messages.length
      })
      console.groupEnd()
    }

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
      if (TEST) {
        console.error('API Error Response:', data)
      }
      const errorMessage = data.detail?.[0]?.msg || data.detail || 'Request failed'
      throw new Error(errorMessage)
    }

    if (TEST) {
      console.log('API Success Response:', data)
    }
    return {
      text: data.response,
      model: data.model_used,
      isError: false
    }
  } catch (error) {
    if (TEST) {
      console.error('API Call Error:', error)
    }
    return {
      text: '',
      isError: true,
      errorMessage: error.message
    }
  }
} 