import type { NextApiRequest, NextApiResponse } from 'next'
import { submitImageGenTask } from '@/lib/klingai-server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '不支持的请求方法' })
  }

  const ak = process.env.NEXT_PUBLIC_KLINGAI_AK
  const sk = process.env.NEXT_PUBLIC_KLINGAI_SK

  if (!ak || !sk) {
    return res.status(500).json({ error: '服务器未配置 KLINGAI_AK 或 KLINGAI_SK' })
  }

  try {
    const { prompt } = req.body
    const result = await submitImageGenTask(ak, sk, { prompt })
    res.status(200).json(result)
  } catch (error) {
    console.error('生成图片错误:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : '请求失败' })
  }
} 