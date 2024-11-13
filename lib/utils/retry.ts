export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: boolean;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true,
    onRetry = () => {}
  } = options

  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw error
      }
      
      onRetry(attempt, lastError)
      
      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
} 