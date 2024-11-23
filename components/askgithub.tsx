'use client'

import { Button } from "@/components/askgithub/ui/button"
import { Card } from "@/components/askgithub/ui/card"
import { Input } from "@/components/askgithub/ui/input"
import { useI18n } from '@/i18n/context'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, GitFork, Star } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { completeSearch } from './askgithub/actions'
import { ExecutionStage, ExecutionStatus } from './askgithub/execution-status'
import { IntroPage } from './askgithub/intro-page'

export type GithubRepo = {
  id: number
  name: string
  full_name: string
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
  extendedQuery?: string
  repos: GithubRepo[]
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
  const [hasSearched, setHasSearched] = useState(false)

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

    setHasSearched(true)
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
    <div className="bg-white">
      <main className="relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-20">
          <Image
            src="/illustrations/man_working.svg"
            alt="AskGitHub"
            width={256}
            height={256}
            priority
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4 relative z-10">
          <motion.div 
            className="flex flex-col items-center"
            animate={{
              marginTop: hasSearched ? '2rem' : '0',
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
 
            {!hasSearched ? (
              <div className="space-y-4">
                <IntroPage onSuggestionClick={(suggestion) => {
                  setQuery(suggestion)
                  handleSearch()
                }} />
                <div className="max-w-2xl mx-auto mb-4">
                  <div className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder={t('askgithub.placeholder')}
                      className="flex-1 h-12 px-4 rounded-md border border-[#d0d7de] bg-white focus:border-[#0969da] focus:ring focus:ring-[#0969da]/10 focus:outline-none text-lg"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={loading}
                      className="h-12 px-6 bg-[#2da44e] hover:bg-[#2c974b] text-white rounded-md font-semibold transition-colors disabled:opacity-60 text-lg"
                    >
                      {loading ? t('askgithub.asking') : t('askgithub.askButton')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-4 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/30'
                                : 'bg-white border border-[#d0d7de] text-[#24292f]'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}

                      {(loading || result) && (
                        <div className="mt-8 space-y-4">
                          <div className="bg-white border border-[#d0d7de] rounded-lg p-4 shadow-sm">
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
                                className="text-[#57606a] hover:text-[#24292f]"
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
                                <div className="bg-[#f6f8fa] p-4 rounded-lg border border-[#d0d7de] mt-4">
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
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </main>
    </div>
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