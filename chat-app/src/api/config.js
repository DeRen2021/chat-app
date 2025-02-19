/*
This file store the API endpoints and model configs

*/

const API_BASE_URL_1 = 'http://localhost:8000/chat'
//const API_BASE_URL_2 = 'https://api.chat.deren.life/chat'


export const API_ENDPOINTS = {
  'gpt-4o': API_BASE_URL_1,
  'claude-3.5': API_BASE_URL_1,
  'deepseek-chat': API_BASE_URL_1,
}

export const DEFAULT_MODEL = 'gpt-4o'

export const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: '功能最强大的GPT模型'
  },
  {
    id: 'claude-3.5',
    name: 'claude-3.5 sonnect',
    description: '快速且经济的选择'
  },
  {
    id: 'deepseek-chat',
    name: 'deepseek-chat',
    description: 'Anthropic的高性能模型'
  }
] 