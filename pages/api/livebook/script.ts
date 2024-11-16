import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content } = req.body

    try {
      const response = await createChatCompletion([
        {
          role: "system",
          content: `你是一个专业的剧本创作助手。请将用户提供的内容转换为规范的剧本格式。
          剧本应该包含：
          1. 场景描述：详细的环境和氛围描述（场景应该尽可能少，可以合并到一起的就合并）
          2. 角色对话：包含角色名称和对话内容
          3. 旁白：用于描述情节发展和过渡
          4. 动作指示：描述角色的动作和表情
          
          请以JSON格式返回，结构如下：
          {
            "title": "剧本标题",
            "scenes": [
              {
                "id": "场景ID",
                "type": "scene|dialogue|narration|action",
                "content": "具体内容",
                "character": "说话的角色（对话类型时）",
                "timestamp": "时间戳"
              }
            ]
          }`
        },
        {
          role: "user",
          content: content
        }
      ])

      let scriptData = response.choices[0].message.content.trim()

      if (scriptData.startsWith('```json')) {
        scriptData = scriptData.slice(7, -3)
      }
      console.log(scriptData);
      const script = JSON.parse(scriptData)
      res.status(200).json(script)
    } catch (error: unknown) {
      console.error('Script generation error:', error)
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error generating script' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 