"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Trophy, TrendingUp, AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)

    const users = JSON.parse(localStorage.getItem("users") || "{}")
    const userStats = users[userObj.email]
    if (userStats) {
      setStats(userStats)
    }
  }, [router])

  if (!user || !stats) {
    return null
  }

  const accuracy =
    stats.totalEmails > 0
      ? Math.round(
          ((stats.correctIdentified / stats.totalEmails) * 100 +
            (1 - stats.scamsClicked / Math.max(1, stats.totalEmails - stats.correctIdentified)) * 100) /
            2,
        )
      : 0

  const performanceData = [
    { week: "Тиждень 1", correct: 2, missed: 1, clicked: 0 },
    { week: "Тиждень 2", correct: 4, missed: 1, clicked: 0 },
    { week: "Тиждень 3", correct: 5, missed: 2, clicked: 1 },
    { week: "Тиждень 4", correct: 7, missed: 1, clicked: 0 },
  ]

  const accuracyData = [
    { name: "Правильно", value: stats.correctIdentified || 0 },
    { name: "Неправильно", value: stats.incorrectIdentified || 0 },
    { name: "Попалися", value: stats.scamsClicked || 0 },
  ]

  const COLORS = ["#65f741", "#ff6b6b", "#ff9800"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Загальний рейтинг</p>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  <span className="text-4xl font-bold text-primary">{stats.rating || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Точність</p>
              <p className="text-3xl font-bold text-primary">{accuracy}%</p>
              <p className="text-xs text-muted-foreground mt-2">{stats.totalEmails} листів перевірено</p>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Розпізнано</p>
              <p className="text-3xl font-bold text-accent">{stats.correctIdentified || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Правильних ідентифікацій</p>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <p className="text-sm text-muted-foreground mb-2">На них впали</p>
              <p className="text-3xl font-bold text-destructive">{stats.scamsClicked || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Помилки з фішингом</p>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Рівень</p>
              <p className="text-3xl font-bold text-secondary">{Math.floor((stats.rating || 0) / 100) + 1}</p>
              <p className="text-xs text-muted-foreground mt-2">Безпеки фахівець</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Chart */}
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <h2 className="text-xl font-bold mb-4 text-foreground">Прогрес за тижнями</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="correct"
                    stroke="var(--color-accent)"
                    name="Правильно"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="missed"
                    stroke="var(--color-primary)"
                    name="Пропущено"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Accuracy Pie Chart */}
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <h2 className="text-xl font-bold mb-4 text-foreground">Розподіл результатів</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Achievements or Tips */}
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Поточна позиція</h2>

            {accuracy >= 80 && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Експерт з безпеки!</p>
                    <p className="text-sm text-muted-foreground">
                      Ви досягли 80%+ точності. Продовжуйте тренування для утримання навичок.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {accuracy < 80 && accuracy >= 50 && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Добрий прогрес!</p>
                    <p className="text-sm text-muted-foreground">
                      Ви на правильному шляху. Ще {80 - accuracy}% до статусу експерта. Продовжуйте!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {accuracy < 50 && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Потрібна практика</p>
                    <p className="text-sm text-muted-foreground">
                      Здається, фішинги вас часто обманюють. Проведіть більше симуляцій для покращення навичок
                      розпізнавання.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  )
}
