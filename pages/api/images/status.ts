import type { NextApiRequest, NextApiResponse } from 'next'
import { getGeneratedImage } from '@/lib/klingai-server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '不支持的请求方法' })
  }

  const ak = process.env.NEXT_PUBLIC_KLINGAI_AK
  const sk = process.env.NEXT_PUBLIC_KLINGAI_SK

  if (!ak || !sk) {
    return res.status(500).json({ error: '服务器未配置 KLINGAI_AK 或 KLINGAI_SK' })
  }

  const { task_id } = req.query
  if (!task_id || typeof task_id !== 'string') {
    return res.status(400).json({ error: '缺少必要的task_id参数' })
  }

  try {
    const result = await getGeneratedImage(ak, sk, task_id)
    res.status(200).json(result)
  } catch (error) {
    console.error('查询任务状态错误:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : '查询失败' })
  }
} 