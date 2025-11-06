"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { phishingEmails } from "@/lib/phishing-data"

type PhishEmail = (typeof phishingEmails)[0]

export default function SimulationPage() {
  const [user, setUser] = useState<any>(null)
  const [currentEmail, setCurrentEmail] = useState<PhishEmail | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [emailCount, setEmailCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const emailsShown = useRef<string[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)
    loadNextEmail()
  }, [router])

  const loadNextEmail = () => {
    const availableEmails = phishingEmails.filter((e) => !emailsShown.current.includes(e.id))

    if (availableEmails.length === 0) {
      emailsShown.current = []
    }

    const randomIndex = Math.floor(Math.random() * availableEmails.length)
    const email = availableEmails[randomIndex]

    emailsShown.current.push(email.id)
    setCurrentEmail(email)
    setUserAnswer(null)
    setSelectedIndicators([])
    setShowFeedback(false)
    setIsCorrect(null)
    setLoading(false)
  }

  const handleAnswer = (isPhishing: boolean) => {
    setUserAnswer(isPhishing)

    if (currentEmail) {
      const correct = (isPhishing && currentEmail.isPhishing) || (!isPhishing && !currentEmail.isPhishing)
      setIsCorrect(correct)

      if (user) {
        const users = JSON.parse(localStorage.getItem("users") || "{}")
        const userStats = users[user.email]

        if (userStats) {
          userStats.totalEmails = (userStats.totalEmails || 0) + 1

          if (correct) {
            userStats.correctIdentified = (userStats.correctIdentified || 0) + 1
            userStats.rating = (userStats.rating || 0) + 10
          } else {
            userStats.incorrectIdentified = (userStats.incorrectIdentified || 0) + 1

            if (currentEmail.isPhishing && !isPhishing) {
              userStats.scamsClicked = (userStats.scamsClicked || 0) + 1
              userStats.rating = Math.max(0, (userStats.rating || 0) - 5)
            }
          }

          users[user.email] = userStats
          localStorage.setItem("users", JSON.stringify(users))
        }
      }

      setEmailCount((prev) => prev + 1)

      if (!isPhishing) {
        setShowFeedback(true)
      }
    }
  }

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator],
    )
  }

  const handleFeedback = () => {
    setShowFeedback(true)
  }

  const handleNext = () => {
    loadNextEmail()
  }

  if (loading || !currentEmail) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Завантаження листа...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">Симуляція поштової скриньки</h1>
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium">
                Лист #{emailCount + 1}
              </span>
            </div>
            <p className="text-muted-foreground">Проаналізуйте лист: це фішинг чи легітимне повідомлення?</p>
          </div>

          {/* Email Display */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
            {/* Email Headers */}
            <div className="border-b border-border pb-4 mb-4">
              <div className="mb-2">
                <label className="block text-xs text-muted-foreground font-medium">ВІД:</label>
                <p className="font-mono text-sm text-foreground break-all">{currentEmail.from}</p>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground font-medium">ТЕМА:</label>
                <p className="font-semibold text-foreground">{currentEmail.subject}</p>
              </div>
            </div>

            {/* Email Body */}
            <div
              className="prose prose-sm max-w-none text-foreground mb-6"
              dangerouslySetInnerHTML={{ __html: currentEmail.body }}
            />
          </Card>

          {/* Decision Section */}
          {!showFeedback && userAnswer === null && (
            <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
              <h2 className="text-xl font-bold mb-6 text-foreground">Який ваш вердикт?</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="h-16 text-lg bg-destructive hover:bg-destructive/90 gap-2"
                >
                  ⚠️ Це фішинг!
                </Button>

                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="h-16 text-lg gap-2 border-accent text-accent hover:bg-accent/10"
                >
                  ✓ Це легітимно
                </Button>
              </div>
            </Card>
          )}

          {/* Indicators Selection (if phishing) */}
          {userAnswer === true && !showFeedback && (
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
              <h3 className="text-lg font-bold mb-4 text-foreground">Виберіть ознаки фішингу:</h3>

              <div className="space-y-2 mb-6">
                {currentEmail.indicators.map((indicator, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/10"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIndicators.includes(indicator)}
                      onChange={() => handleIndicatorToggle(indicator)}
                      className="mt-1"
                    />
                    <span className="text-foreground text-sm">{indicator}</span>
                  </label>
                ))}
              </div>

              <Button
                onClick={handleFeedback}
                disabled={selectedIndicators.length === 0}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2"
              >
                📤 Отримати пояснення
              </Button>
            </Card>
          )}

          {/* Feedback Section */}
          {showFeedback && (
            <Card
              className={`p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-8 border-l-4 ${
                isCorrect ? "border-l-accent bg-accent/5" : "border-l-destructive bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <span className="text-3xl">✓</span>
                    <h3 className="text-2xl font-bold text-accent">Правильно!</h3>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">⚠️</span>
                    <h3 className="text-2xl font-bold text-destructive">Неправильно</h3>
                  </>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-foreground mb-2">Пояснення (Explainable AI):</h4>
                <p className="text-muted-foreground leading-relaxed">{currentEmail.explanation}</p>
              </div>

              {!isCorrect && (
                <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                  <h4 className="font-bold text-foreground mb-2">Як розпізнати це:</h4>
                  <ul className="space-y-2">
                    {currentEmail.indicators.map((indicator, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-secondary">•</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isCorrect && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <h4 className="font-bold text-foreground mb-2">Ознаки, на які ви звернули увагу:</h4>
                  <ul className="space-y-2">
                    {selectedIndicators.map((indicator, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent">✓</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 h-11 gap-2">
                Наступний лист →
              </Button>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
            <h3 className="font-bold text-foreground mb-3">Підказки:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Завжди перевіряйте адресу відправника і домен посилань</li>
              <li>• Спеціальна паніка та мовні помилки - сигнали фішингу</li>
              <li>• Офіційні компанії ніколи не просять паролі або конфіденційні дані емейлом</li>
              <li>• Посилання на аресь офіційних посилань завжди шахрайство</li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  )
}
