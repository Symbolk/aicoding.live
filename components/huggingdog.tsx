'use client'

import { DiscussionThread } from '@/components/huggingdog/discussion-thread'
import { InitDialog } from '@/components/huggingdog/init-dialog'
import { Button } from "@/components/huggingdog/ui/button"
import { Card, CardContent } from "@/components/huggingdog/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/i18n/context'
import { Post } from '@/components/huggingdog/discussion-thread'
import {
  fetchDailyPapers,
  fetchNewDatasets,
  fetchNewModels,
  fetchNewSpaces
} from '@/lib/huggingface'
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import { differenceInDays, format } from "date-fns"
import { enUS, zhCN } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
  Cpu,
  Database,
  FileText,
  Layout
} from "lucide-react"
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from "react"
import { DateRange } from "react-day-picker"

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
    const timer = setTimeout(() => {
      if (!svgRef.current || !containerRef.current) return

      const updateWordCloud = () => {
        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const container = containerRef.current?.getBoundingClientRect()
        if (!container) return

        const width = container.width
        const height = container.height

        const layout = cloud()
          .size([width, height])
          .words(words.map(d => ({ 
            ...d, 
            // 增加字体大小系数从 0.06 到 0.15
            size: (d.value / Math.max(...words.map(w => w.value))) * (Math.min(width, height) * 0.15)
          })))
          .padding(8) // 增加词之间的间距
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

      updateWordCloud()

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateWordCloud)
      })
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [words])

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

export function HuggingDog() {
  const { t, locale } = useI18n()
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    papers: 0,
    models: 0,
    datasets: 0,
    spaces: 0
  })
  const [topics, setTopics] = useState<WordData[]>([])
  const [retweetedReports, setRetweetedReports] = useState<number[]>([])
  const [likedReports, setLikedReports] = useState<number[]>([])
  const [dateModified, setDateModified] = useState(false)
  const [papers, setPapers] = useState<any[]>([])
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showInitDialog, setShowInitDialog] = useState(true)
  const goButtonRef = useRef<HTMLButtonElement>(null)

  const fetchData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) {
      console.warn('Date range is incomplete')
      return
    }

    setLoading(true)
    try {
      const [papersResponse, models, datasets, spaces] = await Promise.all([
        fetchDailyPapers({
          from: dateRange.from,
          to: dateRange.to
        }),
        fetchNewModels({
          from: dateRange.from,
          to: dateRange.to
        }),
        fetchNewDatasets({
          from: dateRange.from,
          to: dateRange.to
        }),
        fetchNewSpaces({
          from: dateRange.from,
          to: dateRange.to
        })
      ])

      console.log('Fetched papers:', papersResponse)
      setPapers(papersResponse.items)

      setStats({
        papers: papersResponse.totalCount,
        models: models.totalCount,
        datasets: datasets.totalCount,
        spaces: spaces.totalCount
      })

      // 生成讨论内容
      setIsGenerating(true)
      try {
        const postsResponse = await fetch('/api/huggingface/generate-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            papers: papersResponse.items, 
            date: dateRange.from.toISOString(),
            locale: locale
          })
        })

        if (postsResponse.ok) {
          const { posts: newPosts } = await postsResponse.json()
          
          // 为每个帖子生成评论
          const postsWithComments = await Promise.all(newPosts.map(async (post: Post) => {
            const commentsResponse = await fetch('/api/huggingface/generate-comments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                mainPost: post.content,
                locale: locale
              })
            })

            if (!commentsResponse.ok) {
              return post
            }

            const { comments } = await commentsResponse.json()
            return { ...post, comments }
          }))

          setGeneratedPosts(postsWithComments)
        }
      } catch (error) {
        console.error('Error generating discussion:', error)
        setGeneratedPosts([])
      } finally {
        setIsGenerating(false)
      }

      // 分析论文主题
      try {
        const response = await fetch('/api/huggingface/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            papers: papersResponse.items
          })
        })

        if (response.ok) {
          const { topics: newTopics } = await response.json()
          console.log('Analyzed topics:', newTopics)
          setTopics(newTopics)
        } else {
          console.error('Failed to analyze topics')
          setTopics([]) // 设置为空数组
        }
      } catch (analyzeError) {
        console.error('Error analyzing topics:', analyzeError)
        setTopics([]) // 错误时设置为空数组
      }

      setDateModified(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setStats({
        papers: 0,
        models: 0,
        datasets: 0,
        spaces: 0
      })
      setPapers([])
      setTopics([])
      setGeneratedPosts([])
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      setDateRange({ from: undefined, to: undefined })
      setDateModified(false)
      return
    }

    // 确保 from 和 to 都存在时才更新状态
    if (range.from && range.to) {
      const from = new Date(Math.min(range.from.getTime(), range.to.getTime()))
      const to = new Date(Math.max(range.from.getTime(), range.to.getTime()))
      setDateRange({ from, to })
      setDateModified(true)
    } else {
      // 如果只选择了一个日期，保持类型一致
      setDateRange({
        from: range.from || undefined,
        to: range.to || undefined
      })
      setDateModified(false)
    }
  }

  const handleGoDog = () => {
    if (dateModified && dateRange.from && dateRange.to) {
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

  const handleInitialDateSelect = (range: DateRange) => {
    if (range.from && range.to) {
      setDateRange({
        from: range.from,
        to: range.to
      })
      setDateModified(true)
      setShowInitDialog(false)
      
      // 使用 setTimeout 确保状态更新后再触发点击
      setTimeout(() => {
        goButtonRef.current?.click()
      }, 0)
    }
  }

  // 在日期格式化时使用对应的 locale
  const dateLocale = locale === 'en' ? enUS : zhCN
  const dateFormat = locale === 'en' ? "MMM dd, yyyy" : "yyyy年MM月dd日"

  return (
    <>
      {showInitDialog && (
        <InitDialog onDateSelect={handleInitialDateSelect} />
      )}
      <div className="flex w-full gap-2">
        <div className="flex-1">
          <div className="flex-1 space-y-4">
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview">{t('huggingdog.overview')}</TabsTrigger>
                  <TabsTrigger value="reports">{t('huggingdog.reports')}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    whileHover={{ 
                      y: -8,  // 向上浮动
                      scale: 1.02,  // 轻微放大
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">{t('huggingdog.dailyPapers')}</p>
                            <p className="text-2xl font-bold">+{stats.papers}</p>
                          </div>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{t('huggingdog.fromLastMonth')}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">{t('huggingdog.createdModels')}</p>
                            <p className="text-2xl font-bold">+{stats.models}</p>
                          </div>
                          <Cpu className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{t('huggingdog.monthlyIncrease')}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">{t('huggingdog.uploadedDatasets')}</p>
                            <p className="text-2xl font-bold">+{stats.datasets}</p>
                          </div>
                          <Database className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{t('huggingdog.monthlyDataIncrease')}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">{t('huggingdog.launchedSpaces')}</p>
                            <p className="text-2xl font-bold">+{stats.spaces}</p>
                          </div>
                          <Layout className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{t('huggingdog.sinceLastHour')}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                  <motion.div
                    className="col-span-4 h-[500px]" // 增加容器高度从 400px 到 500px
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 h-full hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">{t('huggingdog.topicTrends')}</h3>
                        </div>
                        <div className="h-[calc(100%-3rem)] overflow-hidden">
                          {topics.length > 0 ? (
                            <WordCloud words={topics} />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                              {loading ? (
                                <>
                                  <div className="text-4xl mb-4 animate-bounce">🔍</div>
                                  <p className="text-gray-500 font-medium">{t('huggingdog.analyzing')}</p>
                                </>
                              ) : (
                                <>
                                  <div className="text-6xl mb-4 opacity-50">📊</div>
                                  <p className="text-gray-500 font-medium">{t('huggingdog.noTopicData')}</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    className="col-span-3 h-[500px]" // 调整高度以匹配
                    initial={{ backdropFilter: "blur(10px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm hover:backdrop-blur-none transition-all duration-300 h-full hover:shadow-lg hover:border-gray-300">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">{t('huggingdog.hotTopics')}</h3>
                          <p className="text-sm text-gray-500">{t('huggingdog.summarizedByAI')}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <div className="space-y-4">
                            {topics.length > 0 ? (
                              topics.map((topic, index) => (
                                <div key={index} className="w-full">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-medium">{topic.text}</p>
                                    <span className="text-sm text-gray-500">{t('huggingdog.score')}: {topic.value}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-blue-600 h-2.5 rounded-full"
                                      style={{ width: `${(topic.value / Math.max(...topics.map(t => t.value))) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="h-[300px] flex flex-col items-center justify-center">
                                {loading ? (
                                  <>
                                    <div className="text-4xl mb-4 animate-bounce">🔍</div>
                                    <p className="text-gray-500 font-medium">{t('huggingdog.analyzing')}</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-6xl mb-4 opacity-50">📊</div>
                                    <p className="text-gray-500 font-medium">{t('huggingdog.noTopicData')}</p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              <TabsContent value="reports">
                <div className="grid gap-8 md:grid-cols-1 max-w-3xl mx-auto">
                  {dateRange.from && dateRange.to && papers.length > 0 && (
                    <DiscussionThread 
                      posts={generatedPosts}
                      loading={isGenerating}
                      locale={locale}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-[268px] flex flex-col border rounded-lg p-4 bg-white/80 backdrop-blur-sm relative min-h-[600px]">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={1}
            disabled={{ 
              after: new Date(),
              before: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }}
            className="w-full [&_.rdp]:w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-cell]:flex [&_.rdp-cell]:justify-center [&_.rdp-head_cell]:w-full [&_.rdp-button]:w-10 [&_.rdp-button]:h-10 [&_.rdp-nav]:w-full [&_.rdp-caption]:w-full [&_.rdp-caption_start]:w-full [&_.rdp-caption_end]:w-full"
            defaultMonth={dateRange.from || new Date()}
            footer={
              <div className="mt-4 text-sm text-gray-500 space-y-2">
                {!dateRange.from && !dateRange.to && (
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2 opacity-50">📅</div>
                    <p className="text-center font-medium">{t('huggingdog.selectDateRange')}</p>
                  </div>
                )}
                {dateRange.from && !dateRange.to && (
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2 opacity-50">📆</div>
                    <p className="text-center font-medium">{t('huggingdog.selectEndDate')}</p>
                  </div>
                )}
                {dateRange.from && dateRange.to && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">{t('huggingdog.from')}:</span>
                      <span>{format(dateRange.from, dateFormat, { locale: dateLocale })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📆</span>
                      <span className="font-medium">{t('huggingdog.to')}:</span>
                      <span>{format(dateRange.to, dateFormat, { locale: dateLocale })}</span>
                    </div>
                    <div className="flex items-center justify-center text-xs text-gray-400 mt-2">
                      <span className="flex items-center space-x-1">
                        <span className="text-base">📊</span>
                        <span>{t('huggingdog.total')}</span>
                        <span className="font-medium text-sm">{differenceInDays(dateRange.to, dateRange.from) + 1}</span>
                        <span>{t('huggingdog.days')}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
          />
          
          <Button 
            ref={goButtonRef}
            className="mt-4 w-full bg-[#FF4B4B] hover:bg-[#FF4B4B] text-white font-medium py-2 px-4 rounded-lg"
            onClick={handleGoDog}
            disabled={!dateModified || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin mr-2">⌛</span>
                {t('huggingdog.loading')}
              </div>
            ) : (
              t('huggingdog.goDog')
            )}
          </Button>

          <div className="absolute bottom-0 left-0 right-0 h-[200px] flex justify-center items-end pointer-events-none">
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <Image
                  src="/illustrations/dog_walking.svg"
                  alt="Dog Walking"
                  width={200}
                  height={200}
                  className="opacity-20"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}