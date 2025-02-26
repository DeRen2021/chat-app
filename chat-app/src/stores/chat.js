import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendChatMessage } from '../api/chatService'
import { performWebSearch } from '../api/websearchService'
import { DEFAULT_MODEL, TEST } from '../api/config'

export const useChatStore = defineStore('chat', () => {
  // States
  const messages = ref([])
  const selectedModel = ref(DEFAULT_MODEL)
  const systemPrompt = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const isSearchingWeb = ref(false)
  const autoWebSearchEnabled = ref(false)  // Auto web search toggle

  // Action methods
  const addMessage = (message) => {
    const newMessage = {
      id: messages.value.length + 1,
      ...message,
      selected: true, // Selected by default
      timestamp: new Date().toISOString()
    }
    messages.value.push(newMessage)
    
    // Optimized log output
    if (TEST) {
      console.group('Chat History Update')
      if (systemPrompt.value) {
        console.log('System Prompt:', systemPrompt.value)
      }
      console.log('All Messages:')
      messages.value.forEach(msg => {
        console.log(`[${msg.sender}]: ${msg.text}${msg.selected ? '' : ' (Not Selected)'}`)
      })
      console.groupEnd()
    }
  }

  const toggleMessageSelection = (messageId) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      message.selected = !message.selected
      // Update log when message selection changes
      if (TEST) {
        console.group('Message Selection Update')
        console.log(`Message ${messageId} "${message.text.slice(0, 30)}..." selection changed to: ${message.selected}`)
        console.log('Currently selected messages:')
        messages.value
          .filter(msg => msg.selected)
          .forEach(msg => {
            console.log(`[${msg.sender}]: ${msg.text}`)
          })
        console.groupEnd()
      }
    }
  }

  const setModel = (model) => {
    selectedModel.value = model
    if (TEST) {
      console.log('Model switched to:', model)
    }
  }

  const setSystemPrompt = (prompt) => {
    systemPrompt.value = prompt
    if (TEST) {
      console.log('System prompt updated to:', prompt || '(empty)')
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Set auto web search status
  const setAutoWebSearch = (enabled) => {
    autoWebSearchEnabled.value = enabled
    if (TEST) {
      console.log(`Auto web search ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  // API related methods
  const sendMessage = async (text) => {
    try {
      isLoading.value = true
      error.value = null

      // Add user message
      addMessage({
        text,
        sender: 'user'
      })

      // If auto web search is enabled, perform search first
      if (autoWebSearchEnabled.value) {
        isSearchingWeb.value = true
        try {
          if (TEST) {
            console.log('Executing auto web search:', text)
          }
          const searchResult = await performWebSearch(text)
          
          if (!searchResult.isError && searchResult.results && searchResult.results.length > 0) {
            // Add search results as a system message (hidden from user but sent to AI model)
            let resultsText = `Here are the web search results for "${text}":\n\n`;
            
            // Prepare source URL list from search results
            const sourceUrls = searchResult.results.map((result, index) => {
              return {
                index: index + 1,
                url: result.url
              };
            });
            
            // Limit the length of each result to prevent overly long output
            searchResult.results.forEach((result, index) => {
              // Truncate long text to a reasonable length (about 1000 characters)
              const truncatedText = result.text.length > 1000 
                ? result.text.substring(0, 1000) + "..." 
                : result.text;
                
              resultsText += `[${index + 1}] ${truncatedText}\nSource: ${result.url}\n\n`;
            });
            
            // Output search results to console but don't add to message list
            if (TEST) {
              console.log('Web search results:', resultsText);
            }
            
            // Add to message list, but mark as hidden (not displayed to user)
            const searchResultMessage = {
              id: messages.value.length + 1,
              text: resultsText,
              sender: 'system',
              selected: true,
              timestamp: new Date().toISOString(),
              hidden: true,  // Mark as hidden, UI layer won't display
              searchSources: sourceUrls  // Add source URLs to hidden system message for later reference
            };
            
            messages.value.push(searchResultMessage);
            if (TEST) {
              console.log('Auto web search results added to chat history (hidden)');
            }
          }
        } catch (searchError) {
          if (TEST) {
            console.error('Auto web search failed:', searchError)
          }
          // Search failure doesn't affect the main process, continue with chat
        } finally {
          isSearchingWeb.value = false
        }
      }

      // Prepare messages to send to API - keep only necessary fields and selected messages
      const apiMessages = []

      // If there's a system prompt, add it to the beginning of messages
      if (systemPrompt.value.trim()) {
        apiMessages.push({
          role: 'system',
          content: systemPrompt.value
        })
      }

      // Add selected chat history
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

      if (TEST) {
        console.group('Sending API Request')
        console.log('Current model:', selectedModel.value)
        console.log('System prompt:', systemPrompt.value || '(none)')
        console.log('Messages sent:', apiMessages)
        console.groupEnd()
      }

      // Send request
      const response = await sendChatMessage(requestData)

      if (response.isError) {
        throw new Error(response.errorMessage)
      }

      // Fix: Only add search sources when auto web search is enabled and results are found
      // Find the most recent search result in this session (if any)
      let currentSessionSearchMessage = null;
      if (autoWebSearchEnabled.value) {
        // Search backward for the most recent hidden message with search results
        for (let i = messages.value.length - 1; i >= 0; i--) {
          if (messages.value[i].searchSources && messages.value[i].hidden) {
            currentSessionSearchMessage = messages.value[i];
            break;
          }
        }
      }
      
      // Add AI response
      addMessage({
        text: response.text,
        sender: 'bot',
        // Only add sources if auto web search is enabled and results were found
        searchSources: currentSessionSearchMessage?.searchSources || []
      })
    } catch (e) {
      error.value = e.message
      if (TEST) {
        console.error('Message sending failed:', e)
      }
    } finally {
      isLoading.value = false
    }
  }

  // Web search related methods
  const injectWebSearchResults = (searchQuery, results) => {
    isSearchingWeb.value = false

    if (!results || results.length === 0) {
      addMessage({
        text: `No web search results found for "${searchQuery}".`,
        sender: 'system'
      })
      return
    }

    // Add search query as user message
    addMessage({
      text: `Web search: ${searchQuery}`,
      sender: 'user'
    })

    // Add search results as system message
    let resultsText = `Here are the web search results for "${searchQuery}":\n\n`;
    
    results.forEach((result, index) => {
      resultsText += `[${index + 1}] ${result.text}\nSource: ${result.url}\n\n`;
    });

    addMessage({
      text: resultsText,
      sender: 'system'
    })
  }

  return {
    // States
    messages,
    selectedModel,
    systemPrompt,
    isLoading,
    error,
    isSearchingWeb,
    autoWebSearchEnabled,
    // Methods
    sendMessage,
    setModel,
    setSystemPrompt,
    clearError,
    toggleMessageSelection,
    injectWebSearchResults,
    setAutoWebSearch
  }
}) 