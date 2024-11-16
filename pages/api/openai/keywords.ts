import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body

    try {
      const response = await createChatCompletion([
        {
          role: "system",
          content: "你是一个专业的开发者助手。请从用户的查询中提取3-5个最关键的技术关键词，这些关键词将用于在GitHub上搜索相关项目。关键词应该是具体的技术术语、框架名称或特定的开发概念。请将关键词以JSON数组的形式返回，不要包含任何其他文本。"
        },
        {
          role: "user",
          content: query
        }
      ])

      let content = response.choices[0].message.content.trim();
      if (content.startsWith('```json')) {
        content = content.slice(7, -3)
      }
      const keywords = JSON.parse(content)
      console.log('keywords:', keywords)
      res.status(200).json({ keywords })
    } catch (error: unknown) {
      console.error('01 AI API error:', error)
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error extracting keywords' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 

