'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/huggingdog/ui/card"
import { Button } from "@/components/huggingdog/ui/button"
import { MessageCircle, Repeat2, Heart, Share2, BadgeCheck } from "lucide-react"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { useI18n } from '@/i18n/context'

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  time: string
  replies: number
  retweets: number
  likes: number
}

interface DiscussionThreadProps {
  posts: Post[]
  loading: boolean
  locale?: string
}

export interface Post {
  category: string
  content: string
  comments?: Comment[]
}

export function DiscussionThread({ posts, loading, locale = 'zh' }: DiscussionThreadProps) {
  const { t } = useI18n()
  const [retweeted, setRetweeted] = useState<Set<string>>(new Set())
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const handleRetweet = (id: string) => {
    setRetweeted(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={index} className="space-y-3">
          <Card className={cn(
            "border transition-colors duration-200 shadow-lg bg-white/80 backdrop-blur-sm hover:backdrop-blur-none",
            "hover:border-gray-300 hover:shadow-xl",
            "max-w-3xl mx-auto"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src="/avatars/huggingdog.png"
                  alt="HuggingDog"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-gray-900">HuggingDog</span>
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-500">@huggingdog · 刚刚</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-orange-500">#{post.category}</div>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center justify-between mt-3 text-gray-500">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-1 hover:text-gray-900"
                      onClick={() => setExpandedPost(expandedPost === `post-${index}` ? null : `post-${index}`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "flex items-center space-x-1 hover:text-green-500",
                        retweeted.has(`post-${index}`) && "text-green-500"
                      )}
                      onClick={() => handleRetweet(`post-${index}`)}
                    >
                      <Repeat2 className="w-4 h-4" />
                      <span>{152 + (retweeted.has(`post-${index}`) ? 1 : 0)}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "flex items-center space-x-1 hover:text-red-500",
                        liked.has(`post-${index}`) && "text-red-500"  
                      )}
                      onClick={() => handleLike(`post-${index}`)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{848 + (liked.has(`post-${index}`) ? 1 : 0)}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-gray-900">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          {expandedPost === `post-${index}` && post.comments?.map((comment) => (
            <Card 
              key={comment.id}
              className={cn(
                "border transition-colors duration-200 shadow-md bg-white/80 backdrop-blur-sm hover:backdrop-blur-none",
                "hover:border-gray-300 hover:shadow-lg",
                "max-w-3xl mx-auto ml-8"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">@{comment.author.toLowerCase()} · {comment.time}</span>
                    </div>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center justify-between mt-2 text-gray-500">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-gray-900">
                        <MessageCircle className="w-4 h-4" />
                        <span>{comment.replies}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "flex items-center space-x-1 hover:text-green-500",
                          retweeted.has(comment.id) && "text-green-500"
                        )}
                        onClick={() => handleRetweet(comment.id)}
                      >
                        <Repeat2 className="w-4 h-4" />
                        <span>{comment.retweets + (retweeted.has(comment.id) ? 1 : 0)}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "flex items-center space-x-1 hover:text-red-500",
                          liked.has(comment.id) && "text-red-500"
                        )}
                        onClick={() => handleLike(comment.id)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes + (liked.has(comment.id) ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-gray-900">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
} 