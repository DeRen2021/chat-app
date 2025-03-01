/*
This file store the API endpoints and model configs

*/

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL //|| 'http://localhost:8000/chat'
const API_BASE_URL_mac = import.meta.env.VITE_API_BASE_URL_mac //|| 'http://localhost:8000/chat'
export const VOICE_BASE_URL = import.meta.env.VITE_VOICE_BASE_URL //|| 'http://localhost:8001/transcribe/'
export const WEB_SEARCH_BASE_URL = import.meta.env.VITE_WEB_SEARCH_BASE_URL //|| 'http://localhost:8002/search'
export const TEST = import.meta.env.VITE_TEST || false



export const API_ENDPOINTS = {
  'gpt-4o': API_BASE_URL,
  'claude-3-5-sonnet-20241022': API_BASE_URL,
  'deepseek-chat': API_BASE_URL,
  'deepseek-r1-distill-qwen-7b': API_BASE_URL_mac
}

export const DEFAULT_MODEL = 'gpt-4o'

export const AVAILABLE_MODELS = [
  {
    id: 'deepseek-r1-distill-qwen-7b',
    name: 'Deepseek R1 Distill Qwen 7B',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'claude-3-5-sonnet-20241022',
  },
  {
    id: 'deepseek-chat',
    name: 'Deepseek Chat',
  }
] 