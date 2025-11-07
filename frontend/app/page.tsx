"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Award, ArrowRight, Target } from "lucide-react";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Перевіряємо, чи користувач залогінений
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <main className="min-h-screen bg-linear-to-br from-background via-card to-background">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">
                        PhishTrainer
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                                Дашборд
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    Вхід
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                                    Реєстрація
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <section className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center">
                <div className="mb-6 sm:mb-8 inline-block">
                    <span className="px-3 sm:px-4 py-2 bg-secondary/20 text-secondary rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        Розумна платформа для безпеки
                    </span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
                    Навчіться розпізнавати
                    <br />
                    <span className="text-primary">фішингові атаки</span>
                </h2>

                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                    PhishTrainer використовує Explainable AI, щоб не тільки
                    ідентифікувати загрози, а й детально пояснити, на які ознаки
                    шахрайства варто звертати увагу.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16">
                    <Link href="/signup" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-base sm:text-lg h-11 sm:h-12 w-full"
                        >
                            Почати навчання
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 hidden sm:inline" />
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-base sm:text-lg h-11 sm:h-12 bg-transparent w-full sm:w-auto"
                    >
                        Дізнатись більше
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                        </div>
                        <h3 className="font-bold mb-2 text-sm sm:text-base">
                            Реалістичні симуляції
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Практикуйтеся з автентичними фішинговими листами,
                            створеними ШІ
                        </p>
                    </Card>

                    <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                        </div>
                        <h3 className="font-bold mb-2 text-sm sm:text-base">
                            Explainable AI
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Розумійте, чому кожне рішення правильне або хибне
                        </p>
                    </Card>

                    <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 sm:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                        </div>
                        <h3 className="font-bold mb-2 text-sm sm:text-base">
                            Отримуйте рейтинги
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Відстежуйте прогрес і змагайтесь з колегами
                        </p>
                    </Card>
                </div>
            </section>
        </main>
    );
}
