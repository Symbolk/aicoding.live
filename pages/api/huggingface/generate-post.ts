import { createChatCompletion } from '@/lib/01ai'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { papers, date, locale = 'zh' } = req.body
    const validLocale = locale === 'en' ? 'en' : 'zh'  // 确保 locale 只能是 'en' 或 'zh'

    // 首先对论文进行分类
    const classifyPrompt = validLocale === 'zh' 
      ? `请用中文分析并将以下论文按研究主题分类，返回不超过4个主要类别。
        格式要求：每行一个类别，使用 ||| 分隔类别和相关论文编号，例如：
        图像生成|||1,3,5
        自然语言处理|||2,4`
      : `Please analyze and classify the following papers into no more than 4 main categories in English.
        Format: One category per line, use ||| to separate category and paper numbers, e.g.:
        Image Generation|||1,3,5
        Natural Language Processing|||2,4`

    console.log('Locale:', validLocale)
    console.log('Classify prompt:', classifyPrompt)

    const classifyResponse = await createChatCompletion([
      { role: 'system', content: validLocale === 'zh' ? '你是一个专业的AI研究分类专家。' : 'You are a professional AI research classification expert.' },
      { role: 'user', content: classifyPrompt }
    ])

    const categories = classifyResponse?.choices?.[0]?.message?.content
      ?.split('\n')
      .filter(line => line.includes('|||'))
      .map(line => {
        const [category, indices] = line.split('|||').map(s => s.trim())
        const paperIndices = indices.split(',').map(i => parseInt(i.trim()) - 1)
        return {
          category,
          papers: paperIndices.map(i => papers[i]).filter(Boolean)
        }
      })

    if (!categories?.length) {
      throw new Error('Failed to classify papers')
    }

    // 为每个类别生成一条推文
    const posts = await Promise.all(categories.map(async ({ category, papers }) => {
      const postPrompt = validLocale === 'zh'
        ? `作为 HuggingDog，请用中文以推特风格总结这个类别的论文发展趋势。要求：
          1. 使用 @paper_title 的格式引用论文
          2. 分析论文之间的联系和进展
          3. 使用 #hashtag 标记关键技术领域
          4. 语气要活泼专业，带有狗狗特色
          5. 控制在200字以内
          6. 必须使用中文回复

          研究类别：${category}
          论文列表：
          ${papers.map((p: any, index: number) => `
          ${index + 1}. ${p.title}
          作者：${p.authors?.join(', ') || 'Unknown'}
          摘要：${p.summary || 'No summary available'}
          `).join('\n')}
          `
        : `As HuggingDog, please summarize the paper trends in this category in Twitter style in English. Requirements:
            1. Use @paper_title format to cite papers
            2. Analyze connections and progress between papers
            3. Use #hashtag to mark key tech areas
            4. Keep tone professional yet playful with dog-like enthusiasm
            5. Keep within 200 characters
            6. Must reply in English

            Research Category: ${category}
            Papers: ...`

      const systemPrompt = validLocale === 'zh'
        ? '你是 HuggingDog，一个热爱 AI 技术的专业研究狗。你的特点是用简短活泼的语言讨论深奥的技术，喜欢用"汪"来表达兴奋。必须用中文回复。'
        : 'You are HuggingDog, a professional research dog who loves AI tech. Your style is discussing complex tech in a brief and lively way, using "Woof" to express excitement. Must reply in English.'

      const postResponse = await createChatCompletion([
        { 
          role: 'system', 
          content: systemPrompt 
        },
        { role: 'user', content: postPrompt }
      ])

      const content = postResponse?.choices?.[0]?.message?.content

      return {
        category,
        content: content || (validLocale === 'zh' 
          ? `汪！${category}领域又有新进展啦！ #AI #${category.replace(/\s+/g, '')}`
          : `Woof! New progress in ${category}! #AI #${category.replace(/\s+/g, '')}`)
      }
    }))

    return res.status(200).json({ posts })

  } catch (error) {
    console.error('Error generating posts:', error)
    const { locale = 'zh' } = req.body
    const validLocale = locale === 'en' ? 'en' : 'zh'
    return res.status(200).json({ 
      posts: [{
        category: 'AI Research',
        content: validLocale === 'zh'
          ? "汪！今天又是充满AI进展的一天！让我们一起来看看最新的研究成果吧！ #AI #Research"
          : "Woof! Another exciting day in AI! Let's check out the latest research findings! #AI #Research"
      }]
    })
  }
} 