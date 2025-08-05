"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/web/card"
import { Button } from "@workspace/ui/components/web/button"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/web/avatar"
import { Heart, MessageCircle, Users } from "lucide-react"

interface FeedItem {
  id: string
  user: {
    name: string
    avatar: string
    relation: string
  }
  medication: string
  time: string
  message?: string
  likes: number
  comments: number
}

interface FamilyFeedProps {
  feedItems: FeedItem[]
  setFeedItems: React.Dispatch<React.SetStateAction<FeedItem[]>>
}

export function FamilyFeed({ feedItems, setFeedItems }: FamilyFeedProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  const handleLike = (itemId: string) => {
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              likes: likedItems.has(itemId) ? item.likes - 1 : item.likes + 1,
            }
          : item,
      ),
    )

    setLikedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h2 className="text-lg font-semibold">가족 복약 피드</h2>
      </div>

      {feedItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">아직 가족 피드가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1">복약을 완료하면 가족들과 공유됩니다.</p>
          </CardContent>
        </Card>
      ) : (
        feedItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                  <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.user.name}</span>
                    <span className="text-xs text-gray-500">({item.user.relation})</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium text-blue-600">{item.medication}</span>을 복용했습니다.
                  </p>
                  {item.message && <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">{item.message}</p>}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(item.id)}
                      className={`h-8 px-2 ${
                        likedItems.has(item.id) ? "text-red-600 hover:text-red-700" : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {item.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
