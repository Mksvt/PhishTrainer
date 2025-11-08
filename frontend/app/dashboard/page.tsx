"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    CheckCircle,
    XCircle,
    Zap,
    Award,
    ArrowRight,
    Shield,
} from "lucide-react";
import { useGetUserStatsQuery, useGetProfileQuery } from "@/lib/api/apiSlice";

export default function DashboardPage() {
    // RTK Query hooks
    const { data: profileData, isLoading: isProfileLoading } =
        useGetProfileQuery();
    const { data: statsData, isLoading, error } = useGetUserStatsQuery();

    const user = profileData?.user;

    if (isProfileLoading || isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Завантаження...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !statsData) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-destructive">
                            Помилка завантаження статистики
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const stats = statsData.stats;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-linear-to-br from-background via-card to-background">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-foreground">
                            Ласкаво просимо, {user?.name || "Користувач"}!
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Відслідковуйте свій прогрес у розпізнаванні
                            фішингових атак
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                        Рейтинг
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                                        {stats.rating || 0}
                                    </p>
                                </div>
                                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                        Всього листів
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {stats.totalEmails || 0}
                                    </p>
                                </div>
                                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-foreground/30 shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                        Розпізнано
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-accent">
                                        {stats.correctIdentified || 0}
                                    </p>
                                </div>
                                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-accent/30 shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                        На них впали
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-destructive">
                                        {stats.scamsClicked || 0}
                                    </p>
                                </div>
                                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive/30 shrink-0" />
                            </div>
                        </Card>
                    </div>

                    {/* Main Features */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 text-foreground">
                                        Почни тренування
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Пройти через реалістичні симуляції
                                        фішингу та вивчити, як розпізнавати
                                        атаки.
                                    </p>
                                    <Link href="/simulation">
                                        <Button className="bg-primary hover:bg-primary/90 gap-2">
                                            Почати
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 hover:border-secondary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 text-foreground">
                                        Переглянути профіль
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Детальний аналіз вашого прогресу,
                                        рейтингу та історії симуляцій.
                                    </p>
                                    <Link href="/profile">
                                        <Button
                                            variant="outline"
                                            className="gap-2 bg-transparent"
                                        >
                                            Переглянути
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Info Section */}
                    <Card className="p-8 backdrop-blur-sm bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">
                            Як це працює?
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 text-primary font-bold">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">
                                        Отримайте реалістичні листи
                                    </h4>
                                    <p>
                                        Платформа генерує автентичні фішингові
                                        листи та легітимні повідомлення. Листи
                                        не повторюються часто для
                                        різноманітності.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 text-primary font-bold">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">
                                        Прийміть рішення
                                    </h4>
                                    <p>
                                        Проаналізуйте кожний лист та виберіть:
                                        це фішинг чи легітимне повідомлення?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 text-primary font-bold">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">
                                        Отримайте детальні пояснення
                                    </h4>
                                    <p>
                                        Explainable AI розповідає, чому це лист
                                        був/не був фішингом та як його
                                        розпізнати.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </>
    );
}
