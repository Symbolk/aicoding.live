import { SignJWT } from 'jose'
import { withRetry } from './utils/retry'

export async function encodeJwtToken(ak: string, sk: string): Promise<string> {
    if (!ak || !sk) {
        throw new Error('未配置 KLINGAI_AK 或 KLINGAI_SK 环境变量')
    }

    const now = Math.floor(Date.now() / 1000)
    return await new SignJWT({
        iss: ak,
        exp: now + 1800,
        nbf: now - 5
    })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(new TextEncoder().encode(sk))
}

export interface ImageGenParams {
    model?: string;
    prompt: string;
    negative_prompt?: string;
    image?: string;
    image_fidelity?: number;
    n?: number;
    aspect_ratio?: string;
    callback_url?: string;
}

export async function submitImageGenTask(ak: string, sk: string, params: ImageGenParams) {
    return withRetry(
        async () => {
            const apiToken = await encodeJwtToken(ak, sk)
            console.log('apiToken', apiToken)
            const response = await fetch('https://api.klingai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                },
                body: JSON.stringify({
                    model: params.model || 'kling-v1',
                    prompt: params.prompt,
                    negative_prompt: params.negative_prompt,
                    image: params.image,
                    image_fidelity: params.image_fidelity || 0.5,
                    n: params.n || 1,
                    aspect_ratio: '1:1',
                    callback_url: params.callback_url
                })
            })

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('请求过于频繁，请稍后重试')
                }
                throw new Error(`请求失败: ${response.status}`)
            }

            return await response.json()
        },
        {
            maxAttempts: 3,
            delayMs: 2000,
            backoff: true,
            onRetry: (attempt, error) => {
                console.log(`第 ${attempt} 次重试，错误：`, error.message)
            }
        }
    )
}

export async function getGeneratedImage(ak: string, sk: string, taskId: string) {
    return withRetry(
        async () => {
            const apiToken = await encodeJwtToken(ak, sk)
            const response = await fetch(`https://api.klingai.com/v1/images/generations/${taskId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                }
            })

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('请求过于频繁，请稍后重试')
                }
                throw new Error(`查询失败: ${response.status}`)
            }

            return await response.json()
        },
        {
            maxAttempts: 3,
            delayMs: 2000,
            backoff: true,
            onRetry: (attempt, error) => {
                console.log(`第 ${attempt} 次重试，错误：`, error.message)
            }
        }
    )
} 