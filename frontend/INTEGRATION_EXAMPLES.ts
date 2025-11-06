// Приклад інтеграції backend API у frontend

// 1. Створіть файл .env.local у папці frontend:
// NEXT_PUBLIC_API_URL=http://localhost:3001/api

// 2. Використання у login page:

/*
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      
      // Токен і користувач автоматично збережено в localStorage
      console.log('Успішний вхід:', response.user)
      
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || 'Помилка входу')
    } finally {
      setLoading(false)
    }
  }

  // ... решта коду
}
*/

// 3. Використання у signup page:

/*
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api-client"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Паролі не збігаються")
      return
    }

    if (password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({ email, name, password })
      
      console.log('Успішна реєстрація:', response.user)
      
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації')
    } finally {
      setLoading(false)
    }
  }

  // ... решта коду
}
*/

// 4. Використання у simulation page:

/*
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { emailAPI, simulationAPI } from "@/lib/api-client"

export default function SimulationPage() {
  const [currentEmail, setCurrentEmail] = useState<any>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadNextEmail()
  }, [])

  const loadNextEmail = async () => {
    try {
      const response = await emailAPI.getRandom()
      setCurrentEmail(response.email)
      setShowFeedback(false)
      setResult(null)
    } catch (error) {
      console.error('Помилка завантаження листа:', error)
    }
  }

  const handleAnswer = async (isPhishing: boolean) => {
    try {
      const response = await simulationAPI.checkAnswer({
        emailId: currentEmail.id,
        userAnswer: isPhishing
      })

      setResult(response)
      setShowFeedback(true)
    } catch (error) {
      console.error('Помилка перевірки відповіді:', error)
    }
  }

  // ... решта коду
}
*/

// 5. Використання у profile page для статистики:

/*
"use client"

import { useEffect, useState } from "react"
import { simulationAPI, authAPI } from "@/lib/api-client"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        authAPI.getProfile(),
        simulationAPI.getStats()
      ])

      setUser(profileResponse.user)
      setStats(statsResponse.stats)
    } catch (error) {
      console.error('Помилка завантаження даних:', error)
      // Якщо токен невалідний, перенаправляємо на логін
      router.push('/login')
    }
  }

  // ... решта коду з використанням stats
}
*/

// 6. Middleware для захисту сторінок (middleware.ts):

/*
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Список захищених маршрутів
  const protectedPaths = ['/dashboard', '/profile', '/simulation']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/simulation/:path*']
}
*/

export {};
