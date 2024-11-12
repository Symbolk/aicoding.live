import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query, repos, keywords } = req.body

    try {
      const reposData = repos.map((repo: any) => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        url: repo.html_url,
      }))

      const response = await createChatCompletion([
        {
          role: "system",
          content: `你是一个专业的开发者助手。请根据用户的查询和GitHub仓库列表，生成一个结构化的总结。
          总结应该：
          1. 首先为用户提供选择建议，说明哪些仓库最适合用户的需求
          2. 将仓库按照功能或用途分类
          3. 对每个类别下的仓库进行简要说明，包括其主要功能、特点和适用场景
          请用markdown格式输出，使用清晰的标题和列表。`
        },
        {
          role: "user",
          content: `用户查询: ${query}\n关键词: ${keywords.join(', ')}\n仓库数据: ${JSON.stringify(reposData, null, 2)}`
        }
      ])
      const content = response.choices[0].message.content;
      res.status(200).json({ summary: content})
    } catch (error: any) {
      console.error('01 AI API error:', error)
      res.status(500).json({ error: error.message || 'Error generating summary' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 