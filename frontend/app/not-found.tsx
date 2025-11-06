"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background px-4">
      <Card className="p-12 backdrop-blur-sm bg-card/50 border-border/50 text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          Сторінка не знайдена. Вона може бути видалена чи неправильна адреса.
        </p>
        <Link href="/">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4" />
            Повернутися на головну
          </Button>
        </Link>
      </Card>
    </div>
  )
}
