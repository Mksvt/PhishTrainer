export interface User {
  id: string
  email: string
  name: string
  rating: number
  totalEmails: number
  correctIdentified: number
  incorrectIdentified: number
  scamsClicked: number
  createdAt: Date
}

export interface PhishEmail {
  id: string
  subject: string
  from: string
  body: string
  isPhishing: boolean
  indicators: string[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category: "banking" | "paypal" | "amazon" | "social" | "company" | "other"
}

export interface UserAnswer {
  id: string
  userId: string
  emailId: string
  selectedAnswer: boolean // true = phishing, false = legitimate
  selectedIndicators?: string[]
  isCorrect: boolean
  timestamp: Date
}
