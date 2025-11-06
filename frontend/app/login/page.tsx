"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"

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
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      const user = users[email]

      if (!user || user.password !== password) {
        setError("Невірна електронна адреса або пароль")
        setLoading(false)
        return
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      )

      document.cookie = `user=${email}; path=/`

      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (err) {
      setError("Помилка входу. Спробуйте пізніше.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PhishTrainer</h1>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Вхід</h2>
          <p className="text-muted-foreground mb-6">Введіть вашу електронну адресу та пароль</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Електронна адреса</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-11">
              {loading ? "Вхід..." : "Увійти"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Немає акаунту?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Зареєструйтеся
            </Link>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo: використовуйте test@example.com / password123
        </p>
      </div>
    </div>
  )
}
