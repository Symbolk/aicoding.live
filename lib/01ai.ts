interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function createChatCompletion(messages: Message[], temperature: number = 0.3) {
  const response = await fetch('https://api.lingyiwanwu.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_01AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'yi-lightning',
      messages,
      temperature,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create chat completion')
  }

  return response.json() as Promise<ChatCompletionResponse>
} 