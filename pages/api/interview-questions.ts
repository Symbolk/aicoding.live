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

  // 获取语言参数
  const lang = req.query.lang as string || 'zh'
  const systemPrompt = lang === 'zh' 
    ? '你是一个AI面试官，专门出AI和大语言模型相关的面试题。请用简洁专业的中文回答，需要有一定难度。'
    : 'You are an AI interviewer, specializing in AI and large language model related interview questions. Please answer in concise and professional English, with appropriate difficulty.'

  try {
    const response = await createChatCompletion([
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Generate 10 interview questions and answers about AI and large language models. Each question and answer should be concise and clear.
        Format: Return a JSON array with question and answer fields for each item.
        Example: [{"question": "What is a large language model?", "answer": "A large language model is..."}]`
      }
    ])

    const content = response.choices[0]?.message?.content || ''
    let questions: InterviewQA[] = []
    
    try {
      questions = JSON.parse(content)
    } catch {
      try {
        const formattedContent = content
          .replace(/```json\s*|\s*```/g, '')
          .replace(/\n/g, '')
          .trim()
        
        questions = JSON.parse(formattedContent)
      } catch {
        console.error('Failed to parse response')
        questions = lang === 'zh' ? defaultQuestionsZh : defaultQuestionsEn
      }
    }
    
    if (!Array.isArray(questions) || questions.length === 0 || 
        !questions.every(q => typeof q.question === 'string' && typeof q.answer === 'string')) {
      console.error('Invalid questions format')
      questions = lang === 'zh' ? defaultQuestionsZh : defaultQuestionsEn
    }
    
    res.status(200).json(questions)
  } catch (error: any) {
    console.error('Error generating questions', error)
    res.status(500).json({ message: 'Error generating questions' })
  }
}

const defaultQuestionsZh: InterviewQA[] = [
  {
    question: "什么是大语言模型(LLM)?",
    answer: "大语言模型是一种基于深度学习的AI模型，能够理解和生成人类语言。它通过海量文本数据训练，可以执行翻译、问答、摘要等多种自然语言处理任务。"
  },
  {
    question: "GPT-4与GPT-3.5的主要区别是什么?", 
    answer: "GPT-4相比GPT-3.5有更强的推理能力、更好的多模态理解能力，并且在准确性和安全性方面都有显著提升。它可以处理更长的上下文，并能更好地理解细微的指令。"
  }
]

const defaultQuestionsEn: InterviewQA[] = [
  {
    question: "What is a Large Language Model (LLM)?",
    answer: "A Large Language Model is an AI model based on deep learning that can understand and generate human language. It is trained on massive amounts of text data and can perform various natural language processing tasks such as translation, Q&A, and summarization."
  },
  {
    question: "What are the main differences between GPT-4 and GPT-3.5?",
    answer: "GPT-4 has improved reasoning capabilities, better multimodal understanding, and significant enhancements in accuracy and safety compared to GPT-3.5. It can handle longer context and better understand nuanced instructions."
  }
] 