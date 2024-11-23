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

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function createChatCompletion(messages: Message[], temperature: number = 0.3) {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
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
        // 如果是 503 错误，等待后重试
        if (response.status === 503) {
          console.log(`Attempt ${attempt + 1}/${MAX_RETRIES}: Service temporarily unavailable, retrying...`)
          await delay(RETRY_DELAY * (attempt + 1)) // 指数退避
          continue
        }
        
        throw new Error(`AI API error: ${response.statusText}`)
      }

      return response.json() as Promise<ChatCompletionResponse>
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${MAX_RETRIES} failed:`, error)
      lastError = error as Error
      
      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (attempt + 1))
        continue
      }
    }
  }

  // 如果所有重试都失败了，返回一个默认响应
  console.error('All retry attempts failed:', lastError)
  return {
    choices: [{
      message: {
        content: '抱歉，服务暂时不可用，请稍后再试。'
      }
    }]
  } as ChatCompletionResponse
} 