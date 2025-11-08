"use client";

import { Navbar } from "@/components/navbar";
import { StatCard } from "@/features/shared/ui";
import { FeatureCard, InfoSection } from "@/features/dashboard/components";
import { FullPageLoader, ErrorMessage } from "@/features/shared/ui";
import { CheckCircle, XCircle, Zap, Award, Shield } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useStats } from "@/features/shared/hooks";
import { ERROR_MESSAGES } from "@/lib/utils/constants";

export default function DashboardPage() {
    const { user, isLoadingAuth } = useAuth();
    const { stats, isLoadingStats, statsError } = useStats();

    if (isLoadingAuth || isLoadingStats) {
        return (
            <>
                <Navbar />
                <FullPageLoader message="Завантаження..." />
            </>
        );
    }

    if (statsError || !stats) {
        return (
            <>
                <Navbar />
                <ErrorMessage message={ERROR_MESSAGES.STATS_ERROR} />
            </>
        );
    }

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

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                        <StatCard
                            label="Рейтинг"
                            value={stats.rating || 0}
                            icon={Award}
                            iconColor="text-primary/30"
                        />
                        <StatCard
                            label="Всього листів"
                            value={stats.totalEmails || 0}
                            icon={Shield}
                            iconColor="text-foreground/30"
                        />
                        <StatCard
                            label="Розпізнано"
                            value={stats.correctIdentified || 0}
                            icon={CheckCircle}
                            iconColor="text-accent/30"
                        />
                        <StatCard
                            label="На них впали"
                            value={stats.scamsClicked || 0}
                            icon={XCircle}
                            iconColor="text-destructive/30"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <FeatureCard
                            title="Почни тренування"
                            description="Пройти через реалістичні симуляції фішингу та вивчити, як розпізнавати атаки."
                            icon={Zap}
                            iconColor="bg-primary/20"
                            linkHref="/simulation"
                            buttonText="Почати"
                        />
                        <FeatureCard
                            title="Переглянути профіль"
                            description="Детальний аналіз вашого прогресу, рейтингу та історії симуляцій."
                            icon={Shield}
                            iconColor="bg-secondary/20"
                            linkHref="/profile"
                            buttonText="Переглянути"
                            buttonVariant="outline"
                        />
                    </div>

                    <InfoSection />
                </div>
            </main>
        </>
    );
}
