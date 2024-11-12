'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/askgithub/ui/button"
import { Input } from "@/components/askgithub/ui/input"
import { Card } from "@/components/askgithub/ui/card"
import { completeSearch } from './actions'
import { ArrowUpRight, Star, GitFork, Github, ChevronDown, ChevronUp } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { ExecutionStatus, ExecutionStage } from './execution-status'
import ReactMarkdown from 'react-markdown'

type Repo = {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  language: string
  forks_count: number
}

type Message = {
  type: 'user' | 'ai'
  content: string
}

type SearchResult = {
  extendedQuery: string
  repos: Repo[]
  summary: string
}

// 添加一个辅助函数来检查文本是否会超过三行
function willTextOverflow(text: string): boolean {
  const CHARS_PER_LINE = 60
  const LINES = 3
  return text?.length > CHARS_PER_LINE * LINES
}

export function AskGitHub() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [currentStage, setCurrentStage] = useState<ExecutionStage>('thinking')
  const [completedStages, setCompletedStages] = useState<ExecutionStage[]>([])
  const [selectedStage, setSelectedStage] = useState<ExecutionStage>('thinking')
  const [stageResults, setStageResults] = useState<Record<ExecutionStage, string>>({
    thinking: '',
    keywords: '',
    searching: '',
    summarizing: ''
  })
  const [isResultExpanded, setIsResultExpanded] = useState(true)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true)
  const [isReposExpanded, setIsReposExpanded] = useState(true)

  const stages: ExecutionStage[] = ['thinking', 'keywords', 'searching', 'summarizing']
  const stageText: Record<ExecutionStage, string> = {
    thinking: t('askgithub.stages.thinking'),
    keywords: t('askgithub.stages.keywords'),
    searching: t('askgithub.stages.searching'),
    summarizing: t('askgithub.stages.summarizing')
  }

  const renderRepoDescription = useCallback((description: string) => {
    const isLongText = willTextOverflow(description)

    return isLongText ? (
      <>
        <p className="text-[#57606a] mt-1 line-clamp-3 group-hover:invisible">
          {description}
        </p>
        <div className="invisible group-hover:visible absolute top-0 left-0 right-0 bg-white p-2 rounded-md shadow-lg border border-[#d0d7de] z-10">
          {description}
        </div>
      </>
    ) : (
      <p className="text-[#57606a] mt-1">
        {description}
      </p>
    )
  }, [])

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setMessages([{ type: 'user', content: query }])
    setCompletedStages([])
    setStageResults({
      thinking: '',
      keywords: '',
      searching: '',
      summarizing: ''
    })
    setCurrentStage('thinking')
    setSelectedStage('thinking')

    try {
      const result = await completeSearch(query, (status) => {
        const stage = status.type as ExecutionStage
        setCurrentStage(stage)
        setStageResults(prev => ({
          ...prev,
          [stage]: status.content
        }))
        if (stage !== 'thinking') {
          setCompletedStages(prev => [...prev, stages[stages.indexOf(stage) - 1]])
        }
      })

      setCompletedStages(prev => [...prev, 'summarizing'])
      setResult(result)
    } catch (error) {
      console.error('Error during search:', error)
      setMessages(prev => [...prev, { type: 'ai', content: t('askgithub.error') }])
    } finally {
      setLoading(false)
      setQuery('')
    }
  }, [query, t, stages])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Github className="w-8 h-8 mr-2 text-[#24292f]" />
          <h1 className="text-5xl font-bold text-[#24292f]">{t('askgithub.title')}</h1>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={t('askgithub.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pr-24 py-6 text-lg bg-[#f6f8fa] border-[#d0d7de] rounded-lg focus:ring-2 focus:ring-[#0969da] focus:border-transparent"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2da44e] hover:bg-[#2c974b] text-white font-semibold py-2 px-4 rounded-md"
            >
              {loading ? t('askgithub.asking') : t('askgithub.askButton')}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(t('askgithub.suggestions')).map(([key, suggestion]) => (
              <Button
                key={key}
                variant="ghost"
                className="text-[#57606a] hover:text-[#24292f] hover:bg-[#f6f8fa] border border-[#d0d7de] rounded-full"
                onClick={() => {
                  setQuery(suggestion)
                  handleSearch()
                }}
              >
                {suggestion}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            ))}
          </div>

          <div className="space-y-4 mt-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-[#0969da] text-white'
                      : 'bg-[#f6f8fa] text-[#24292f] border border-[#d0d7de]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {(loading || result) && (
              <div className="mt-8 space-y-4 border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center">
                  <ExecutionStatus
                    stages={stages}
                    currentStage={currentStage}
                    completedStages={completedStages}
                    onStageClick={setSelectedStage}
                    stageText={stageText}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResultExpanded(!isResultExpanded)}
                    className="text-gray-500"
                  >
                    {isResultExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        {t('askgithub.collapse')}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        {t('askgithub.expand')}
                      </>
                    )}
                  </Button>
                </div>

                {isResultExpanded && (
                  <>
                    <div className="bg-[#f6f8fa] p-4 rounded-lg border border-[#d0d7de]">
                      {stageResults[selectedStage]}
                    </div>

                    {!loading && result && (
                      <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-bold text-[#24292f] flex items-center gap-2">
                            {t('askgithub.finalSummary')}
                          </h2>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                            className="text-gray-500"
                          >
                            {isSummaryExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                {t('askgithub.collapse')}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                {t('askgithub.expand')}
                              </>
                            )}
                          </Button>
                        </div>
                        {isSummaryExpanded && (
                          <div className="bg-[#f6f8fa] p-4 rounded-lg border border-[#d0d7de] prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                p: ({ children }) => <p className="mb-4">{children}</p>,
                                code: ({ children }) => (
                                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
                                ),
                              }}
                            >
                              {result.summary}
                            </ReactMarkdown>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-bold text-[#24292f] mt-8 flex items-center gap-2">
                            {t('askgithub.recommendedRepos')}
                          </h2>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsReposExpanded(!isReposExpanded)}
                            className="text-gray-500"
                          >
                            {isReposExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                {t('askgithub.collapse')}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                {t('askgithub.expand')}
                              </>
                            )}
                          </Button>
                        </div>
                        {isReposExpanded && (
                          <div className="grid grid-cols-1 gap-4">
                            {result?.repos.map((repo) => (
                              <Card
                                key={repo.html_url}
                                className="p-4 border border-[#d0d7de] hover:border-[#0969da] transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="w-full">
                                    <a
                                      href={repo.html_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#0969da] hover:underline font-semibold text-lg"
                                    >
                                      {repo.name}
                                    </a>
                                    <div className="relative">
                                      {renderRepoDescription(repo.description)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-sm text-[#57606a]">
                                  {repo.language && (
                                    <span className="flex items-center">
                                      <span
                                        className="w-3 h-3 rounded-full mr-1"
                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                      />
                                      {repo.language}
                                    </span>
                                  )}
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    {repo.stargazers_count.toLocaleString()}
                                  </span>
                                  <span className="flex items-center">
                                    <GitFork className="w-4 h-4 mr-1" />
                                    {repo.forks_count.toLocaleString()}
                                  </span>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    // Add more languages as needed
  }
  return colors[language] || '#8b949e'
}