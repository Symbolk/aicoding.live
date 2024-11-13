import { SignJWT } from 'jose'
import { NextApiRequest, NextApiResponse } from 'next'

const ak = process.env.NEXT_PUBLIC_KLINGAI_AK || ''
const sk = process.env.NEXT_PUBLIC_KLINGAI_SK || ''

async function encodeJwtToken(ak: string, sk: string): Promise<string> {
    if (!ak || !sk) {
        throw new Error('未配置 KLINGAI_AK 或 KLINGAI_SK 环境变量')
    }

    const now = Math.floor(Date.now() / 1000)

    const token = await new SignJWT({
        iss: ak,
        exp: now + 1800, // 有效时间：当前时间+1800s(30min)
        nbf: now - 5     // 开始生效时间：当前时间-5秒
    })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(new TextEncoder().encode(sk))

    return token
}


interface ImageGenParams {
    model?: string;
    prompt: string;
    negative_prompt?: string;
    image?: string;
    image_fidelity?: number;
    n?: number;
    aspect_ratio?: string;
    callback_url?: string;
}

export async function submitImageGenTask(params: ImageGenParams) {
    const apiToken = await encodeJwtToken(ak, sk)

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
            aspect_ratio: params.aspect_ratio || '16:9',
            callback_url: params.callback_url
        })
    })

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
    }

    return await response.json()
}

export interface GenerationResult {
    code: number;
    message: string;
    request_id: string;
    data: {
        task_id: string;
        task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
        task_status_msg: string;
        created_at: number;
        updated_at: number;
        task_result?: {
            images: Array<{
                index: number;
                url: string;
            }>;
        };
    };
}


export async function getGeneratedImage(taskId: string): Promise<GenerationResult> {
    const apiToken = await encodeJwtToken(ak, sk)

    const response = await fetch(`https://api.klingai.com/v1/images/generations/${taskId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        }
    })

    if (!response.ok) {
        throw new Error(`查询失败: ${response.status}`)
    }

    return await response.json()
}

// 修改 handler 函数来支持 GET 请求
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const result = await submitImageGenTask(req.body)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : '请求失败' })
        }
    } else if (req.method === 'GET') {
        const { task_id } = req.query

        if (!task_id || typeof task_id !== 'string') {
            return res.status(400).json({ error: '缺少必要的task_id参数' })
        }

        try {
            const result = await getGeneratedImage(task_id)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : '查询失败' })
        }
    } else {
        res.status(405).json({ error: '不支持的请方法' })
    }
}

export interface ImageGenerationProgress {
    status: 'idle' | 'submitting' | 'generating' | 'success' | 'error';
    progress: number;
    url?: string;
    error?: string;
}

export async function generateImageWithProgress(
    prompt: string,
    onProgress: (progress: ImageGenerationProgress) => void
): Promise<void> {
    const cacheKey = `image_cache_${prompt}`
    const cachedResult = sessionStorage.getItem(cacheKey)
    if (cachedResult) {
        const cached = JSON.parse(cachedResult)
        onProgress({
            status: 'success',
            progress: 100,
            url: cached.url
        })
        return
    }

    try {
        onProgress({ status: 'submitting', progress: 0 })

        const submitResponse = await fetch('/api/images/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        })

        if (!submitResponse.ok) {
            throw new Error('提交图片生成任务失败')
        }

        const submitResult = await submitResponse.json()
        console.log('Submit result:', submitResult)
        
        if (submitResult.code !== 0) {
            throw new Error(submitResult.message || '提交任务失败')
        }

        onProgress({ status: 'generating', progress: 30 })

        let retryCount = 0
        const maxRetries = 60  // 增加到60次，总共等待5分钟
        const pollInterval = 5000  // 每5秒查询一次
        const startTime = Date.now()

        while (retryCount < maxRetries) {
            try {
                const statusResponse = await fetch(`/api/images/status?task_id=${submitResult.data.task_id}`)
                if (!statusResponse.ok) {
                    throw new Error('查询任务状态失败')
                }

                const taskResult = await statusResponse.json()
                console.log('Task result:', taskResult)

                if (taskResult.code !== 0) {
                    throw new Error(taskResult.message || '查询任务状态失败')
                }

                switch (taskResult.data.task_status) {
                    case 'submitted':
                    case 'processing':
                        // 更平滑的进度更新
                        const progressIncrement = (90 - 30) / maxRetries
                        onProgress({ 
                            status: 'generating', 
                            progress: Math.min(30 + progressIncrement * retryCount, 90)
                        })
                        break
                    case 'succeed':
                        if (taskResult.data.task_result?.images[0]) {
                            const imageUrl = taskResult.data.task_result.images[0].url
                            console.log('Image generated successfully:', imageUrl)
                            
                            sessionStorage.setItem(cacheKey, JSON.stringify({
                                url: imageUrl,
                                timestamp: Date.now()
                            }))
                            
                            onProgress({
                                status: 'success',
                                progress: 100,
                                url: imageUrl
                            })
                            return
                        }
                        throw new Error('生成结果中没有图片URL')
                    case 'failed':
                        throw new Error(taskResult.data.task_status_msg || '图片生成失败')
                    default:
                        console.warn('Unknown task status:', taskResult.data.task_status)
                }

                // 只有在 submitted 或 processing 状态时继续轮询
                if (['submitted', 'processing'].includes(taskResult.data.task_status)) {
                    await new Promise(resolve => setTimeout(resolve, pollInterval))
                    retryCount++
                } else {
                    break
                }
            } catch (error) {
                console.error('Poll error:', error)
                retryCount++
                
                if (retryCount >= maxRetries) {
                    throw new Error('重试次数过多，请稍后再试')
                }
                
                // 指数退避策略，但最大不超过30秒
                const backoffDelay = Math.min(pollInterval * Math.pow(1.5, retryCount), 30000)
                await new Promise(resolve => setTimeout(resolve, backoffDelay))
            }
        }

        throw new Error('图片生成超时，请重试')

    } catch (error) {
        console.error('生成图片错误:', error)
        onProgress({
            status: 'error',
            progress: 0,
            error: error instanceof Error ? error.message : '未知错误'
        })
    }
}
