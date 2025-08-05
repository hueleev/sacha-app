"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Plus, Star, Film, Book, Headphones, Camera, User, Heart, Bookmark, HelpCircle, X } from "lucide-react"
import AddTaste from "./add-taste"

interface MainAppProps {
  user: any
  onLogout: () => void
}

interface TasteItem {
  id: string
  type: "movie" | "book" | "music" | "photo"
  title: string
  rating?: number
  image: string
  author: string
  description: string
  likes: number
  isFollowing: boolean
  isBookmarked: boolean
}

export default function MainApp({ user, onLogout }: MainAppProps) {
  const [showAddTaste, setShowAddTaste] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "movie" | "book" | "music" | "photo">("all")
  const [ratingFilter, setRatingFilter] = useState<"all" | 1 | 2 | 3 | 4 | 5>("all")
  const [hideDuplicates, setHideDuplicates] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // 샘플 데이터
  const [tastes, setTastes] = useState<TasteItem[]>([
    {
      id: "1",
      type: "movie",
      title: "라라랜드",
      rating: 5,
      image: "/placeholder.svg?height=300&width=300",
      author: "user123",
      description: "정말 감동적인 뮤지컬 영화였어요. 음악과 영상미가 완벽했습니다.",
      likes: 12,
      isFollowing: false,
      isBookmarked: true,
    },
    {
      id: "2",
      type: "book",
      title: "1984",
      rating: 4,
      image: "/placeholder.svg?height=300&width=300",
      author: "bookworm",
      description: "조지 오웰의 걸작. 현재 사회를 돌아보게 만드는 책이에요.",
      likes: 8,
      isFollowing: true,
      isBookmarked: false,
    },
    {
      id: "3",
      type: "music",
      title: "Bohemian Rhapsody",
      rating: 5,
      image: "/placeholder.svg?height=300&width=300",
      author: "musiclover",
      description: "퀸의 대표곡. 들을 때마다 소름이 돋아요.",
      likes: 15,
      isFollowing: false,
      isBookmarked: true,
    },
    {
      id: "4",
      type: "photo",
      title: "오늘의 커피",
      image: "/placeholder.svg?height=300&width=300",
      author: "coffeeholic",
      description: "집 근처 카페에서 마신 라떼. 라떼아트가 예뻤어요.",
      likes: 5,
      isFollowing: true,
      isBookmarked: false,
    },
    {
      id: "5",
      type: "movie",
      title: "기생충",
      rating: 5,
      image: "/placeholder.svg?height=300&width=300",
      author: "cinephile",
      description: "봉준호 감독의 걸작. 사회적 메시지가 강렬했습니다.",
      likes: 20,
      isFollowing: false,
      isBookmarked: true,
    },
    {
      id: "6",
      type: "book",
      title: "코스모스",
      rating: 4,
      image: "/placeholder.svg?height=300&width=300",
      author: "sciencefan",
      description: "칼 세이건의 명저. 우주에 대한 경이로움을 느꼈어요.",
      likes: 11,
      isFollowing: true,
      isBookmarked: false,
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="w-3 h-3" />
      case "book":
        return <Book className="w-3 h-3" />
      case "music":
        return <Headphones className="w-3 h-3" />
      case "photo":
        return <Camera className="w-3 h-3" />
      default:
        return null
    }
  }

  const filteredTastes = tastes
    .filter((taste) => filterType === "all" || taste.type === filterType)
    .filter((taste) => {
      if (ratingFilter === "all") return true
      return taste.rating === ratingFilter
    })
    .filter((taste, index, array) => {
      if (!hideDuplicates) return true
      if (taste.type === "photo") return true // 사진은 중복 제거 안함

      // 같은 제목의 첫 번째 항목만 표시
      return array.findIndex((t) => t.title === taste.title && t.type === taste.type) === index
    })

  const handleAddTaste = (newTaste: any) => {
    const taste: TasteItem = {
      id: Date.now().toString(),
      ...newTaste,
      author: user.name,
      likes: 0,
      isFollowing: false,
      isBookmarked: false,
    }
    setTastes([taste, ...tastes])
    setShowAddTaste(false)
  }

  const toggleFollow = (id: string) => {
    setTastes(tastes.map((taste) => (taste.id === id ? { ...taste, isFollowing: !taste.isFollowing } : taste)))
  }

  const toggleLike = (id: string) => {
    setTastes(tastes.map((taste) => (taste.id === id ? { ...taste, likes: taste.likes + 1 } : taste)))
  }

  const toggleBookmark = (id: string) => {
    setTastes(tastes.map((taste) => (taste.id === id ? { ...taste, isBookmarked: !taste.isBookmarked } : taste)))
  }

  if (showAddTaste) {
    return <AddTaste onAdd={handleAddTaste} onCancel={() => setShowAddTaste(false)} />
  }

  const renderGridItem = (taste: TasteItem) => (
    <div key={taste.id} className="border-r border-b border-black bg-white">
      <div className="aspect-square border-b border-black">
        <img src={taste.image || "/placeholder.svg"} alt={taste.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            {getTypeIcon(taste.type)}
            {taste.type}
          </span>
          {taste.rating && (
            <div className="flex items-center gap-0.5">
              {[...Array(taste.rating)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />
              ))}
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm mb-1 line-clamp-1">{taste.title}</h3>
        <p className="text-xs text-gray-500 mb-2">by {taste.author}</p>
        <p className="text-xs text-gray-700 line-clamp-2 mb-2">{taste.description}</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button onClick={() => toggleLike(taste.id)} className="flex items-center gap-1 hover:text-red-500">
              <Heart className="w-3 h-3" />
              {taste.likes}
            </button>
            <button
              onClick={() => toggleBookmark(taste.id)}
              className={`hover:text-blue-500 ${taste.isBookmarked ? "text-blue-600" : "text-gray-500"}`}
            >
              <Bookmark className={`w-3 h-3 ${taste.isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
          <button onClick={() => toggleFollow(taste.id)} className="text-gray-500 hover:text-black">
            {taste.isFollowing ? "팔로잉" : "팔로우"}
          </button>
        </div>
      </div>
    </div>
  )

  const HelpTooltip = () => (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">도움말</h3>
          <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <h4 className="font-medium mb-1">📝 MoiMoi</h4>
            <p className="text-gray-600">내가 직접 올린 취향들을 모아볼 수 있어요</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">🌍 Tastopia</h4>
            <p className="text-gray-600">모든 사용자들의 다양한 취향을 탐색해보세요</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">👥 FavFolk</h4>
            <p className="text-gray-600">팔로우한 사람들의 취향만 골라서 볼 수 있어요</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">⭐ ZzimZzim</h4>
            <p className="text-gray-600">북마크한 취향들을 저장해두고 나중에 다시 볼 수 있어요</p>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <h4 className="font-medium mb-1">🔄 중복 숨기기</h4>
            <p className="text-gray-600">같은 제목의 영화/책/음악이 여러 개 있을 때 하나만 보여줍니다</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b border-black bg-white">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold" style={{ fontFamily: "serif" }}>
            Taste Buds
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAddTaste(true)}
              className="bg-white hover:bg-gray-50 text-black border border-black text-sm px-3 py-1 h-auto w-auto flex items-center justify-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              취향 등록
            </Button>
            <Avatar className="w-6 h-6 border border-black flex items-center justify-center">
              <AvatarFallback className="bg-white text-xs">
                <User className="w-3 h-3" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="border-b border-black bg-white">
        <div className="p-3 space-y-3">
          {/* 카테고리 필터 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              {["all", "movie", "book", "music", "photo"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`${
                    filterType === type ? "text-black font-medium" : "text-gray-500"
                  } hover:text-black transition-colors`}
                >
                  {type === "all"
                    ? "전체"
                    : type === "movie"
                      ? "영화"
                      : type === "book"
                        ? "책"
                        : type === "music"
                          ? "음악"
                          : "사진"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setHideDuplicates(!hideDuplicates)}
                className={`text-xs px-2 py-1 border border-black ${
                  hideDuplicates ? "bg-black text-white" : "bg-white text-black"
                } hover:bg-gray-100 transition-colors`}
              >
                중복 숨기기
              </button>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-5 h-5 border border-black rounded-full bg-white hover:bg-gray-100 flex items-center justify-center"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
              {showHelp && <HelpTooltip />}
            </div>
          </div>

          {/* 별점 필터 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">별점:</span>
            <Select
              value={ratingFilter.toString()}
              onValueChange={(value) =>
                setRatingFilter(value === "all" ? "all" : (Number.parseInt(value) as 1 | 2 | 3 | 4 | 5))
              }
            >
              <SelectTrigger className="w-auto h-8 border border-black rounded-none bg-white text-black">
                <SelectValue placeholder="별점" />
              </SelectTrigger>
              <SelectContent className="w-auto border border-black rounded-none bg-white text-black">
                <SelectItem
                  value="all"
                  className="[&>.absolute]:hidden px-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                >
                  전체
                </SelectItem>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem
                    key={rating}
                    value={rating.toString()}
                    className="group [&>.absolute]:hidden px-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-black text-black group-data-[state=checked]:fill-white group-data-[state=checked]:text-white"
                        />
                      ))}
                      <span>{rating}점</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="moimoi" className="w-full">
        <div className="border-b border-black bg-white">
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="moimoi"
              className="border-r border-black data-[state=active]:bg-gray-100 data-[state=active]:text-black bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              MoiMoi
            </TabsTrigger>
            <TabsTrigger
              value="tastopia"
              className="border-r border-black data-[state=active]:bg-gray-100 data-[state=active]:text-black bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              Tastopia
            </TabsTrigger>
            <TabsTrigger
              value="favfolk"
              className="border-r border-black data-[state=active]:bg-gray-100 data-[state=active]:text-black bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              FavFolk
            </TabsTrigger>
            <TabsTrigger
              value="zzimzzim"
              className="border-r border-black data-[state=active]:bg-gray-100 data-[state=active]:text-black bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              ZzimZzim
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="moimoi" className="mt-0">
          <div className="grid grid-cols-2 border-l border-black">
            {filteredTastes.filter((taste) => taste.author === user.name).map(renderGridItem)}
          </div>
        </TabsContent>

        <TabsContent value="tastopia" className="mt-0">
          <div className="grid grid-cols-2 border-l border-black">{filteredTastes.map(renderGridItem)}</div>
        </TabsContent>

        <TabsContent value="favfolk" className="mt-0">
          <div className="grid grid-cols-2 border-l border-black">
            {filteredTastes.filter((taste) => taste.isFollowing).map(renderGridItem)}
          </div>
        </TabsContent>

        <TabsContent value="zzimzzim" className="mt-0">
          <div className="grid grid-cols-2 border-l border-black">
            {filteredTastes.filter((taste) => taste.isBookmarked).map(renderGridItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
