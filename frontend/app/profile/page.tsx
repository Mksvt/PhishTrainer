"use client";

import { Navbar } from "@/components/navbar";
import { StatCard, FullPageLoader, ErrorMessage } from "@/features/shared/ui";
import {
    ProgressChart,
    AccuracyChart,
    AchievementStatus,
} from "@/features/profile/components";
import { Trophy } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useStats, useWeeklyProgress } from "@/features/shared/hooks";
import { ERROR_MESSAGES } from "@/lib/utils/constants";

export default function ProfilePage() {
    const { user, isLoadingAuth } = useAuth();
    const { stats, isLoadingStats, statsError } = useStats();
    const { weeklyProgress, isLoadingWeekly } = useWeeklyProgress(4);

    if (isLoadingAuth || isLoadingStats) {
        return (
            <>
                <Navbar />
                <FullPageLoader message="Завантаження статистики..." />
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
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4">
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 wrap-break-word">
                                    {user?.name || "Користувач"}
                                </h1>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                    Загальний рейтинг
                                </p>
                                <div className="flex sm:justify-end items-center gap-2">
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                                        {stats.rating || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                        <StatCard
                            label="Точність"
                            value={`${stats.accuracy || 0}%`}
                            icon={Trophy}
                            iconColor="text-primary/30"
                        />
                        <StatCard
                            label="Розпізнано"
                            value={stats.correctIdentified || 0}
                            icon={Trophy}
                            iconColor="text-accent/30"
                        />
                        <StatCard
                            label="На них впали"
                            value={stats.scamsClicked || 0}
                            icon={Trophy}
                            iconColor="text-destructive/30"
                        />
                        <StatCard
                            label="Рівень"
                            value={stats.level || 1}
                            icon={Trophy}
                            iconColor="text-secondary/30"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 min-h-[400px] lg:min-h-[500px]">
                        <ProgressChart
                            data={weeklyProgress}
                            isLoading={isLoadingWeekly}
                        />
                        <AccuracyChart
                            correctIdentified={stats.correctIdentified || 0}
                            incorrectIdentified={stats.incorrectIdentified || 0}
                            scamsClicked={stats.scamsClicked || 0}
                        />
                    </div>

                    <AchievementStatus accuracy={stats.accuracy || 0} />
                </div>
            </main>
        </>
    );
}
