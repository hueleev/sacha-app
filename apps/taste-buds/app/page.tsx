"use client"

import { useState } from "react"
import Auth from "@/components/auth"
import MainApp from "@/components/main-app"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {!isLoggedIn ? <MainApp user={{
        name:'hi'
      }} onLogout={handleLogout} /> : <Auth onLogin={handleLogin} />}
    </div>
  )
}
