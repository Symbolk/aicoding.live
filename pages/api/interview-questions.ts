import { createChatCompletion } from '@/lib/01ai'
import { NextApiRequest, NextApiResponse } from 'next'

export interface InterviewQA {
  question: string
  answer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const response = await createChatCompletion([
      {
        role: 'system',
        content: '你是一个AI面试官，专门出AI和大语言模型相关的面试题。请用简洁专业的语言回答，需要有一定难度。'
      },
      {
        role: 'user',
        content: `生成10个关于AI和大语言模型的面试问题和答案。每个问题和答案都应该简洁明了。
        格式要求：返回一个JSON数组，每个元素包含question和answer两个字段。
        示例：[{"question": "什么是大语言模型?", "answer": "大语言模型是..."}]`
      }
    ])

    const content = response.choices[0]?.message?.content || ''
    let questions: InterviewQA[] = []
    
    try {
      questions = JSON.parse(content)
    } catch (error) {
      try {
        const formattedContent = content
          .replace(/```json\s*|\s*```/g, '')
          .replace(/\n/g, '')
          .trim()
        
        questions = JSON.parse(formattedContent)
      } catch (error) {
        console.error('Failed to parse formatted response:', error)
        questions = defaultQuestions
      }
    }
    
    if (!Array.isArray(questions) || questions.length === 0 || 
        !questions.every(q => typeof q.question === 'string' && typeof q.answer === 'string')) {
      console.error('Invalid questions format:', questions)
      questions = defaultQuestions
    }
    
    res.status(200).json(questions)
  } catch (error) {
    console.error('Error generating questions:', error)
    res.status(500).json({ message: 'Error generating questions' })
  }
}

// 默认问题，当API调用失败时使用
const defaultQuestions: InterviewQA[] = [
  {
    question: "什么是大语言模型(LLM)?",
    answer: "大语言模型是一种基于深度学习的AI模型，能够理解和生成人类语言。它通过海量文本数据训练，可以执行翻译、问答、摘要等多种自然语言处理任务。"
  },
  {
    question: "GPT-4与GPT-3.5的主要区别是什么?", 
    answer: "GPT-4相比GPT-3.5有更强的推理能力、更好的多模态理解能力，并且在准确性和安全性方面都有显著提升。它可以处理更长的上下文，并能更好地理解细微的指令。"
  }
] 