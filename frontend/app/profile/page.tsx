"use client";

import { Navbar } from "@/components/navbar";
import { StatCard, FullPageLoader, ErrorMessage } from "@/features/shared/ui";
import {
    ProgressChart,
    AccuracyChart,
    AchievementStatus,
} from "@/features/profile/components";
import { Trophy, Target, CheckCircle, XCircle, Award } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useStats, useWeeklyProgress } from "@/features/shared/hooks";
import { ERROR_MESSAGES } from "@/lib/utils/constants";
import { useState, useEffect } from "react";

export default function ProfilePage() {
    const { user, isLoadingAuth } = useAuth();
    const { stats, isLoadingStats, statsError } = useStats();
    const { weeklyProgress, isLoadingWeekly } = useWeeklyProgress(4);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isLoadingAuth || isLoadingStats) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
                </div>
                <Navbar />
                <FullPageLoader message="Завантаження статистики..." />
            </div>
        );
    }

    if (statsError || !stats) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
                </div>
                <Navbar />
                <ErrorMessage message={ERROR_MESSAGES.STATS_ERROR} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                />
                <div
                    className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                />
                <div
                    className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
            </div>

            <Navbar />

            <main className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    <div className="mb-8 sm:mb-12">
                        <div className="inline-block mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                                <Target className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-green-300">
                                    Мій профіль
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4">
                            <div className="min-w-0">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 wrap-break-word">
                                    <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        {user?.name || "Користувач"}
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-gray-300 truncate">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0 backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10">
                                <p className="text-xs sm:text-sm text-gray-400 mb-1">
                                    Загальний рейтинг
                                </p>
                                <div className="flex sm:justify-end items-center gap-2">
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400">
                                        {stats.rating || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                            <StatCard
                                label="Точність"
                                value={`${stats.accuracy || 0}%`}
                                icon={Target}
                                iconColor="text-blue-400"
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                            <StatCard
                                label="Розпізнано"
                                value={stats.correctIdentified || 0}
                                icon={CheckCircle}
                                iconColor="text-green-400"
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-red-500/30 transition-all duration-300">
                            <StatCard
                                label="На них впали"
                                value={stats.scamsClicked || 0}
                                icon={XCircle}
                                iconColor="text-red-400"
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <StatCard
                                label="Рівень"
                                value={stats.level || 1}
                                icon={Award}
                                iconColor="text-purple-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 min-h-[400px] lg:min-h-[500px]">
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                            <ProgressChart
                                data={weeklyProgress}
                                isLoading={isLoadingWeekly}
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
                            <AccuracyChart
                                correctIdentified={stats.correctIdentified || 0}
                                incorrectIdentified={
                                    stats.incorrectIdentified || 0
                                }
                                scamsClicked={stats.scamsClicked || 0}
                            />
                        </div>
                    </div>

                    <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
                        <AchievementStatus accuracy={stats.accuracy || 0} />
                    </div>
                </div>
            </main>
        </div>
    );
}
