"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Award, ArrowRight, Target } from "lucide-react";

export default function Home() {
    useEffect(() => {
        // Initialize demo user on first load
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        if (!users["test@example.com"]) {
            users["test@example.com"] = {
                id: "1",
                email: "test@example.com",
                name: "Демо користувач",
                password: "password123",
                rating: 245,
                totalEmails: 24,
                correctIdentified: 19,
                incorrectIdentified: 3,
                scamsClicked: 2,
                createdAt: new Date(),
            };
            localStorage.setItem("users", JSON.stringify(users));
        }
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">
                        PhishTrainer
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link href="/login">
                        <Button variant="outline">Вхід</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-primary hover:bg-primary/90">
                            Реєстрація
                        </Button>
                    </Link>
                </div>
            </nav>

            <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="mb-8 inline-block">
                    <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Розумна платформа для безпеки
                    </span>
                </div>

                <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                    Навчіться розпізнавати
                    <br />
                    <span className="text-primary">фішингові атаки</span>
                </h2>

                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    PhishTrainer використовує Explainable AI, щоб не тільки
                    ідентифікувати загрози, а й детально пояснити, на які ознаки
                    шахрайства варто звертати увагу.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Link href="/signup">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-lg h-12"
                        >
                            Почати навчання
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg h-12 bg-transparent"
                    >
                        Дізнатись більше
                    </Button>
                </div>

                <div className="mb-16 p-4 bg-secondary/10 border border-secondary/30 rounded-lg inline-block">
                    <p className="text-sm text-muted-foreground mb-2">
                        Спробувати демо:
                    </p>
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-secondary"
                        >
                            Email: test@example.com | Пароль: password123
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="font-bold mb-2">
                            Реалістичні симуляції
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Практикуйтеся з автентичними фішинговими листами,
                            створеними ШІ
                        </p>
                    </Card>

                    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="font-bold mb-2">Explainable AI</h3>
                        <p className="text-sm text-muted-foreground">
                            Розумійте, чому кожне рішення правильне або хибне
                        </p>
                    </Card>

                    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="font-bold mb-2">Отримуйте рейтинги</h3>
                        <p className="text-sm text-muted-foreground">
                            Відстежуйте прогрес і змагайтесь з колегами
                        </p>
                    </Card>
                </div>
            </section>
        </main>
    );
}
