const HF_API_BASE = 'https://huggingface.co'

interface HFResponse<T> {
  items: T[]
  totalCount: number
}

interface Paper {
  id: string
  title: string
  authors: string[]
  summary: string
  publishedAt: string
}

interface Model {
  id: string
  modelId: string
  downloads: number
  likes: number
  tags: string[]
  createdAt: string
}

interface Dataset {
  id: string
  name: string
  downloads: number
  likes: number
  tags: string[]
  createdAt: string
}

interface Space {
  id: string
  name: string
  likes: number
  tags: string[]
  createdAt: string
}

export async function fetchDailyPapers(date: Date): Promise<HFResponse<Paper>> {
  const formattedDate = date.toISOString().split('T')[0]
  const response = await fetch(`${HF_API_BASE}/api/daily_papers`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch papers: ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log(data);
  // 过滤出指定日期的论文
  const filteredData = data.filter((paper: Paper) => {
    const paperDate = new Date(paper.publishedAt).toISOString().split('T')[0]
    return paperDate === formattedDate
  })
  
  return {
    items: filteredData,
    totalCount: filteredData.length
  }
}

export async function fetchNewModels(date: Date): Promise<HFResponse<Model>> {
  const formattedDate = date.toISOString().split('T')[0]
  const response = await fetch(`${HF_API_BASE}/api/models?sort=createdAt&direction=-1&limit=100`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log(data);

  // 过滤出指定日期创建的模型
  const filteredData = data.filter((model: Model) => {
    const modelDate = new Date(model.createdAt).toISOString().split('T')[0]
    return modelDate === formattedDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
}

export async function fetchNewDatasets(date: Date): Promise<HFResponse<Dataset>> {
  const formattedDate = date.toISOString().split('T')[0]
  const response = await fetch(`${HF_API_BASE}/api/datasets?sort=createdAt&direction=-1&limit=100`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log(data);

  // 过滤出指定日期创建的数据集
  const filteredData = data.filter((dataset: Dataset) => {
    const datasetDate = new Date(dataset.createdAt).toISOString().split('T')[0]
    return datasetDate === formattedDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
}

export async function fetchNewSpaces(date: Date): Promise<HFResponse<Space>> {
  const formattedDate = date.toISOString().split('T')[0]
  const response = await fetch(`${HF_API_BASE}/api/spaces?sort=createdAt&direction=-1&limit=100`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spaces: ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log(data);

  // 过滤出指定日期创建的空间
  const filteredData = data.filter((space: Space) => {
    const spaceDate = new Date(space.createdAt).toISOString().split('T')[0]
    return spaceDate === formattedDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
} 