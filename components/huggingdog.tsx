'use client'

import { Button } from "@/components/huggingdog/ui/button"
import { Card, CardContent } from "@/components/huggingdog/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  CalendarIcon, 
  FileText, 
  Cpu, 
  Database, 
  Layout,
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  BadgeCheck
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { format } from "date-fns"
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useI18n } from '@/i18n/context'
import {
  fetchDailyPapers,
  fetchNewModels,
  fetchNewDatasets,
  fetchNewSpaces
} from '@/lib/huggingface'

interface WordData {
  text: string;
  value: number;
  size?: number;
  x?: number;
  y?: number;
  rotate?: number;
}

const hotTopics: WordData[] = [
  { text: "Transformer Models", value: 64 },
  { text: "Natural Language Processing", value: 55 },
  { text: "Computer Vision", value: 41 },
  { text: "Reinforcement Learning", value: 38 },
  { text: "Few-Shot Learning", value: 35 },
  { text: "Generative AI", value: 31 },
  { text: "Multimodal Learning", value: 28 },
  { text: "Federated Learning", value: 26 },
  { text: "Explainable AI", value: 24 },
  { text: "Graph Neural Networks", value: 22 },
]

const reports = [
    {
      id: 1,
      category: 'Papers',
      content: '📑 Exciting developments in transformer architecture! @attention-is-all-you-need revolutionizes sequence modeling while @bert advances language understanding. #NLP #Transformers #DeepLearning',
      time: '2h',
      replies: 45,
      retweets: 152,
      likes: 848,
    },
    {
      id: 2,
      category: 'Models',
      content: '🤖 Model Development Insights: New models show major improvements in NLP and computer vision tasks. Exciting progress in efficient deployment for edge devices! #AI #DeepLearning',
      time: '4h',
      replies: 32,
      retweets: 128,
      likes: 567,
    },
    {
      id: 3,
      category: 'Datasets',
      content: '📊 Dataset Trends: New diverse datasets covering multilingual NLP and specialized domains like healthcare. Focus on creating fair and unbiased training data. #DataScience #AI',
      time: '6h',
      replies: 28,
      retweets: 95,
      likes: 412,
    },
    {
      id: 4,
      category: 'Spaces',
      content: '🚀 Spaces Showcase: Check out our latest interactive demos of state-of-the-art models and educational tools! Collaboration is at an all-time high. #HuggingFace #AIDemo',
      time: '8h',
      replies: 56,
      retweets: 203,
      likes: 945,
    }
]

const papers: Record<string, { title: string; authors: string; abstract: string }> = {
  "attention-is-all-you-need": {
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms..."
  },
  "bert": {
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations..."
  }
}

// ... 其余代码保持不变，包括 reports 数组定义 ...

const WordCloud = ({ words }: { words: WordData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 添加一个小延时确保组件已挂载
    const timer = setTimeout(() => {
      if (!svgRef.current || !containerRef.current) return

      const updateWordCloud = () => {
        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        // 获取容器的实际宽度和高度
        const container = containerRef.current?.getBoundingClientRect()
        if (!container) return

        const width = container.width
        const height = container.height

        const layout = cloud()
          .size([width, height])
          .words(words.map(d => ({ 
            ...d, 
            // 根据容器大小调整字体大小
            size: (d.value / Math.max(...words.map(w => w.value))) * (width * 0.08)
          })))
          .padding(5)
          .rotate(() => ~~(Math.random() * 2) * 90)
          .font("Impact")
          .fontSize(d => d.size!)
          .on("end", (words: WordData[]) => {
            svg
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", `translate(${width / 2},${height / 2})`)
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", d => `${d.size}px`)
              .style("font-family", "Impact")
              .style("fill", (_, i) => d3.schemeCategory10[i % 10])
              .attr("text-anchor", "middle")
              .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
              .text(d => d.text)
          })

        layout.start()
      }

      // 初始渲染
      updateWordCloud()

      // 添加窗口大小变化监听
      const resizeObserver = new ResizeObserver(() => {
        // 同样添加延时处理
        requestAnimationFrame(updateWordCloud)
      })
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      // 清理
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current)
        }
      }
    }, 100) // 100ms 延时

    return () => clearTimeout(timer)
  }, [words])

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}

export function HuggingDog() {
  const { t } = useI18n()
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [, setStats] = useState({
    papers: 0,
    models: 0,
    datasets: 0,
    spaces: 0
  })
  const [, setTopics] = useState<WordData[]>([])
  const [retweetedReports, setRetweetedReports] = useState<number[]>([])
  const [likedReports, setLikedReports] = useState<number[]>([])
  const [dateModified, setDateModified] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 并行获取所有数据
      const [papers, models, datasets, spaces] = await Promise.all([
        fetchDailyPapers(date),
        fetchNewModels(date),
        fetchNewDatasets(date),
        fetchNewSpaces(date)
      ])

      // 更新统计数据
      setStats({
        papers: papers.totalCount,
        models: models.totalCount,
        datasets: datasets.totalCount,
        spaces: spaces.totalCount
      })

      // 分析主题
      const response = await fetch('/api/huggingface/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          papers: papers.items,
          models: models.items,
          datasets: datasets.items,
          spaces: spaces.items
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze data')
      }

      const { topics } = await response.json()
      setTopics(topics)
      setDateModified(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [date])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setDateModified(true)
    }
  }

  const handleGoDog = () => {
    if (dateModified) {
      fetchData()
    }
  }

  const handleRetweet = (id: number) => {
    setRetweetedReports(prev => 
      prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
    )
  }

  const handleLike = (id: number) => {
    setLikedReports(prev => 
      prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex-1 space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">{t('huggingdog.overview')}</TabsTrigger>
              <TabsTrigger value="reports">{t('huggingdog.reports')}</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "LLL dd, y") : <span>{t('huggingdog.pickDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={handleDateChange}
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={handleGoDog}
                disabled={!dateModified || loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">⌛</span>
                    {t('huggingdog.loading')}
                  </div>
                ) : (
                  t('huggingdog.goDog')
                )}
              </Button>
            </div>
          </div>
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">{t('huggingdog.dailyPapers')}</p>
                      <p className="text-2xl font-bold">+10</p>
                    </div>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{t('huggingdog.fromLastMonth')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">{t('huggingdog.createdModels')}</p>
                      <p className="text-2xl font-bold">+10</p>
                    </div>
                    <Cpu className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{t('huggingdog.monthlyIncrease')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">{t('huggingdog.uploadedDatasets')}</p>
                      <p className="text-2xl font-bold">+10</p>
                    </div>
                    <Database className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{t('huggingdog.monthlyDataIncrease')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">{t('huggingdog.launchedSpaces')}</p>
                      <p className="text-2xl font-bold">+10</p>
                    </div>
                    <Layout className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{t('huggingdog.sinceLastHour')}</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <Card className="col-span-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{t('huggingdog.topicTrends')}</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <WordCloud words={hotTopics} />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{t('huggingdog.hotTopics')}</h3>
                    <p className="text-sm text-gray-500">{t('huggingdog.summarizedByAI')}</p>
                  </div>
                  <div className="mt-4 space-y-4">
                    {hotTopics.map((topic, index) => (
                      <div key={index} className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium">{topic.text}</p>
                          <span className="text-sm text-gray-500">{t('huggingdog.score')}: {topic.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(topic.value / Math.max(...hotTopics.map(t => t.value))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
              {reports.map((report) => (
                <Card 
                  key={report.id} 
                  className="border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L8Wdz0ZjlBFo2Hnmf4UOmU5HGTPyGN.png"
                        alt="HuggingDog"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-gray-900">HuggingDog</span>
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-500">@huggingdog · {report.time}</span>
                        </div>
                        <p className="mt-1 text-gray-900">
                          {report.content.split(/(@\w+[-\w]*)/g).map((part, index) => {
                            if (part.startsWith('@')) {
                              const paperKey = part.slice(1)
                              const paper = papers[paperKey]
                              if (paper) {
                                return (
                                  <HoverCard key={index}>
                                    <HoverCardTrigger asChild>
                                      <span className="text-blue-500 hover:underline cursor-pointer">
                                        {part}
                                      </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                      <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">{paper.title}</h4>
                                        <p className="text-sm text-gray-500">{paper.authors}</p>
                                        <p className="text-sm">{paper.abstract}</p>
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
                                )
                              }
                            }
                            return part
                          })}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-gray-500">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{report.replies}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center space-x-1 ${retweetedReports.includes(report.id) ? 'text-green-500' : ''}`}
                            onClick={() => handleRetweet(report.id)}
                          >
                            <Repeat2 className="w-4 h-4" />
                            <span>{retweetedReports.includes(report.id) ? report.retweets + 1 : report.retweets}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center space-x-1 ${likedReports.includes(report.id) ? 'text-red-500' : ''}`}
                            onClick={() => handleLike(report.id)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>{likedReports.includes(report.id) ? report.likes + 1 : report.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}