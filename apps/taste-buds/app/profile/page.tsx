'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/shadcn/button"
import { Input } from "@workspace/ui/components/shadcn/input"
import { Textarea } from "@workspace/ui/components/shadcn/textarea"
import { useSession } from "next-auth/react"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("선택된 파일 없음")
  const [isEditing, setIsEditing] = useState(false) // New state

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setImage(session.user.image || "")

      // Fetch existing profile data
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json()
            if (data.hasProfile) {
              setNickname(data.profile.nickname || "")
              setBio(data.profile.bio || "")
              // If image is not provided by session, use the one from profile
              if (session.user && !session.user.image && data.profile.image) {
                setImage(data.profile.image)
              }
              setIsEditing(true)
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err)
        }
      }
      fetchProfile()
    }
  }, [session])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname || !name) {
      setError("이름과 닉네임을 입력해주세요.")
      return
    }
    setLoading(true)
    setError("")

    try {
      const method = isEditing ? "PUT" : "POST" // Determine method based on isEditing
      const response = await fetch("/api/profile", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, nickname, bio }),
      })

      if (response.ok) {
        // Manually update the session to reflect the new name and image
        await update({ name, image })
        router.push("/main")
      } else {
        const data = await response.json()
        setError(data.message || "프로필 등록에 실패했습니다.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로필 등록 중 오류가 발생했습니다.")
    }
    setLoading(false)
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 mx-3 border border-black shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">{isEditing ? "프로필 수정" : "프로필 등록"}</h1>
        <p className="text-center text-gray-500 mb-6">{isEditing ? "프로필 정보를 수정해주세요." : "Taste Buds에 오신 것을 환영합니다!<br/>프로필을 완성해주세요."}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
              className="border-black"
            />
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임 <span className="text-red-500">*</span></label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
              className="border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지 (선택)</label>
            {image && <img src={image} alt="Profile preview" className="w-24 h-24 rounded-full mx-auto mb-4" />}
            <div className="flex items-center">
              <label htmlFor="image" className="cursor-pointer bg-white border border-black text-black px-4 py-2 hover:bg-gray-100">
                파일 선택
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="ml-3 text-gray-500">
                {fileName}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">소개 (선택)</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신을 소개해보세요"
              className="border-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800 rounded-none">
            {loading ? (isEditing ? "수정 중..." : "등록 중...") : (isEditing ? "수정하기" : "등록하기")}
          </Button>
          {isEditing && (
              <Button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={() => router.back()} // Navigate back
                  className="w-full bg-gray-200 text-black hover:bg-gray-300 rounded-none "
              >
                취소
              </Button>
          )}
        </form>
      </div>
    </div>
  )
}
