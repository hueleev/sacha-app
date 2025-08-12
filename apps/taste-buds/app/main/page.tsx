'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MainApp from "@/components/main-app"

export default function MainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileState, setProfileState] = useState<"loading" | "exists" | "not-exists">("loading")
  const [profileData, setProfileData] = useState<any>(null) // New state for profile data

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
      return
    }

    if (status === "authenticated") {
      const checkProfile = async () => {
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json()
            if (data.hasProfile) {
              setProfileState("exists")
              setProfileData(data.profile) // Assuming 'profile' key holds the profile data
            } else {
              router.push("/profile")
            }
          } else {
            // Handle error, maybe redirect to an error page or show a message
            router.push("/profile") // Or some error page
          }
        } catch (error) {
          console.error("Failed to check profile", error)
          // Handle fetch error
        }
      }
      checkProfile()
    }
  }, [status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading" || profileState === "loading" || !session?.user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (profileState === "exists") {
    return <MainApp user={session.user} profile={profileData} onLogout={handleLogout} />
  }

  // This will be shown briefly during redirect, or if something goes wrong
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>
}
