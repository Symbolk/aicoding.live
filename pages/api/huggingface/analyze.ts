import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { papers, models, datasets, spaces } = req.body

    try {
      const response = await createChatCompletion([
        {
          role: "system",
          content: `你是一个专业的AI研究助手。请分析提供的数据，提取主要主题和趋势。
          分析应该：
          1. 识别最重要的主题和技术领域
          2. 为每个主题计算一个重要性分数(0-100)
          3. 考虑数据的流行度指标(下载量、点赞数等)
          请以JSON格式返回，包含topics数组，每个主题包含text和value字段。返回应且仅应包含一个json对象，不要包含其他内容。`
        },
        {
          role: "user",
          content: JSON.stringify({ papers, models, datasets, spaces })
        }
      ])

      let content = response.choices[0].message.content.trim()
      if (content.startsWith('```json')) {
        content = content.slice(7, -3)
      }
      console.log(content)
      const topics = JSON.parse(content)
      res.status(200).json(topics)
    } catch (error: unknown) {
      console.error('Analysis error:', error)
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error analyzing data' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 