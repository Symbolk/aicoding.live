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
  _id: string
  id: string
  downloads: number
  likes: number
  tags: string[]
  createdAt: string
}

interface Dataset {
  _id: string
  id: string
  downloads: number
  likes: number
  tags: string[]
  createdAt: string
}

interface Space {
  _id: string
  id: string
  likes: number
  tags: string[]
  createdAt: string
}

interface DateRange {
  from: Date
  to: Date
}

export async function fetchDailyPapers(dateRange: DateRange): Promise<HFResponse<Paper>> {
  const startDate = new Date(dateRange.from)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999)

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const limit = Math.max(100, daysDiff * 10)

  try {
    const response = await fetch(`${HF_API_BASE}/api/daily_papers?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch papers: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    const filteredData = data.filter((paper: Paper) => {
      const paperDate = new Date(paper.publishedAt)
      return paperDate >= startDate && paperDate <= endDate
    })
    
    return {
      items: filteredData,
      totalCount: filteredData.length
    }
  } catch (error) {
    console.error('Error fetching papers:', error)
    return {
      items: [],
      totalCount: 0
    }
  }
}

export async function fetchNewModels(dateRange: DateRange): Promise<HFResponse<Model>> {
  const startDate = new Date(dateRange.from)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999)

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const limit = Math.max(100, daysDiff * 5)

  const response = await fetch(`${HF_API_BASE}/api/models?sort=lastModified&direction=-1&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  const filteredData = data.filter((model: Model) => {
    const modelDate = new Date(model.createdAt)
    return modelDate >= startDate && modelDate <= endDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
}

export async function fetchNewDatasets(dateRange: DateRange): Promise<HFResponse<Dataset>> {
  const startDate = new Date(dateRange.from)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999)

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const limit = Math.max(100, daysDiff * 3)

  const response = await fetch(`${HF_API_BASE}/api/datasets?sort=lastModified&direction=-1&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  const filteredData = data.filter((dataset: Dataset) => {
    const datasetDate = new Date(dataset.createdAt)
    return datasetDate >= startDate && datasetDate <= endDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
}

export async function fetchNewSpaces(dateRange: DateRange): Promise<HFResponse<Space>> {
  const startDate = new Date(dateRange.from)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999)

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const limit = Math.max(100, daysDiff * 2)

  const response = await fetch(`${HF_API_BASE}/api/spaces?sort=lastModified&direction=-1&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spaces: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  const filteredData = data.filter((space: Space) => {
    const spaceDate = new Date(space.createdAt)
    return spaceDate >= startDate && spaceDate <= endDate
  })

  return {
    items: filteredData,
    totalCount: filteredData.length
  }
} 