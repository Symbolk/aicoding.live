import { GithubRepo } from "../askgithub"

// 解析用户查询为关键词
async function extractKeywords(query: string): Promise<string[]> {
  const response = await fetch('/api/openai/keywords', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch keywords')
  }

  const data = await response.json()
  return data.keywords
}

// 搜索GitHub仓库
async function searchGithubRepos(keyword: string) {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch repositories')
  }

  return response.json()
}

// 生成摘要
async function generateRepoSummary(query: string, repos: GithubRepo[], keywords: string[]): Promise<string> {
  const response = await fetch('/api/openai/summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, repos, keywords }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate summary')
  }

  const data = await response.json()
  return data.summary
}

// 主搜索函数
export async function searchGithub(query: string, keywords: string[]): Promise<GithubRepo[]> {
  let allRepos: GithubRepo[] = [] 
  
  for (const keyword of keywords) {
    const repos = await searchGithubRepos(keyword)
    allRepos = [...allRepos, ...repos]
  }

  // 去重并按星数排序
  const uniqueRepos = Array.from(new Map(allRepos.map(repo => [repo.id, repo])).values())
  return uniqueRepos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10)
}

// 导出用于状态更新的类型
export type SearchStatus = {
  type: 'thinking' | 'keywords' | 'searching' | 'summarizing'
  content: string
}

// 完整的搜索流程
export async function completeSearch(
  query: string,
  onStatusUpdate: (status: SearchStatus) => void
): Promise<{ repos: GithubRepo[], summary: string }> {
  // 思考阶段
  onStatusUpdate({ type: 'thinking', content: '正在分析你的问题...' })
  const keywords = await extractKeywords(query)
  onStatusUpdate({ type: 'keywords', content: `提取到的关键词: ${keywords.join(', ')}` })

  // 搜索阶段
  onStatusUpdate({ type: 'searching', content: '正在搜索相关仓库...' })
  const repos = await searchGithub(query, keywords)
  onStatusUpdate({ type: 'searching', content: `相关仓库个数: ${repos.length}` })
  
  // 总结阶段
  onStatusUpdate({ type: 'summarizing', content: '正在生成总结报告...' })
  const summary = await generateRepoSummary(query, repos, keywords)

  return { repos, summary }
} 