import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

const DOG_NAMES = {
  zh: [
    '研究汪',
    '数据狗',
    '机器学习汪',
    '神经网络狗',
    '深度学习汪'
  ],
  en: [
    'ResearchPup',
    'DataDog',
    'MLWoofer',
    'NeuralPup',
    'DeepBark'
  ]
} as const

function getDefaultComment(locale: string = 'zh') {
  const validLocale = locale === 'en' ? 'en' : 'zh'
  const names = DOG_NAMES[validLocale]

  return [{
    id: 'comment-1',
    author: names[0],
    avatar: `/avatars/dog.png`,
    content: validLocale === 'zh' ? "汪！这个发现太棒了！" : "Woof! This finding is amazing!",
    time: validLocale === 'zh' ? '刚刚' : 'just now',
    replies: Math.floor(Math.random() * 20),
    retweets: Math.floor(Math.random() * 50),
    likes: Math.floor(Math.random() * 100)
  }]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { mainPost, locale = 'zh' } = req.body
    const validLocale = locale === 'en' ? 'en' : 'zh'

    if (!mainPost) {
      console.log('No mainPost provided')
      return res.status(200).json({ 
        comments: getDefaultComment(validLocale)
      })
    }

    const prompt = validLocale === 'zh'
      ? `作为一个AI研究狗，请用中文对这条推文发表一条简短的评论，评论要专业且带有狗狗的特色：
        1. 必须使用中文回复
        2. 可以使用"汪"等拟声词
        3. 评论要简短有趣

        原推文：${mainPost}`
      : `As an AI research dog, please make a brief comment on this tweet in English. Requirements:
        1. Must reply in English
        2. Can use "Woof" and similar expressions
        3. Keep it brief and fun

        Original tweet: ${mainPost}`

    const systemPrompt = validLocale === 'zh'
      ? '你是一个专业的 AI 研究狗。请用简短的一句话回复，语气要活泼可爱。必须用中文回复，不要使用任何英文。'
      : 'You are a professional AI research dog. Please reply with a short sentence in a lively and cute tone. Must reply in English only, do not use any Chinese.'

    const aiResponse = await createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ])

    const content = aiResponse?.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in AI response:', aiResponse)
      return res.status(200).json({ 
        comments: getDefaultComment(validLocale)
      })
    }

    const comments = [{
      id: 'comment-1',
      author: DOG_NAMES[validLocale][0],
      avatar: `/avatars/dog.png`,
      content: content,
      time: validLocale === 'zh' ? '刚刚' : 'just now',
      replies: Math.floor(Math.random() * 20),
      retweets: Math.floor(Math.random() * 50),
      likes: Math.floor(Math.random() * 100)
    }]

    return res.status(200).json({ comments })

  } catch (error) {
    console.error('Error details:', {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    
    const { locale = 'zh' } = req.body
    const validLocale = locale === 'en' ? 'en' : 'zh'
    return res.status(200).json({ 
      comments: getDefaultComment(validLocale)
    })
  }
} 