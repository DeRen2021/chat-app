/*
This file provides web search functionality, sending requests to the web search API
*/
import { WEB_SEARCH_BASE_URL, TEST } from './config'

export async function performWebSearch(query) {
  try {
    if (TEST) {
      console.group('Web Search Request')
      console.log('Request URL:', WEB_SEARCH_BASE_URL)
      console.log('Search Query:', query)
      console.groupEnd()
    }

    const response = await fetch(WEB_SEARCH_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (TEST) {
        console.error('Web Search Error Response:', data)
      }
      throw new Error(data.detail || 'Search request failed')
    }

    if (TEST) {
      console.log('Web Search Response:', data)
    }
    return {
      results: data.results || [],
      totalResults: data.total_results || 0,
      isError: false
    }
  } catch (error) {
    if (TEST) {
      console.error('Web Search Call Error:', error)
    }
    return {
      results: [],
      totalResults: 0,
      isError: true,
      errorMessage: error.message
    }
  }
} 