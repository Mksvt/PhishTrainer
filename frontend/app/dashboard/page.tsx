"use client";

import { Navbar } from "@/components/navbar";
import { StatCard } from "@/features/shared/ui";
import { FeatureCard, InfoSection } from "@/features/dashboard/components";
import { FullPageLoader, ErrorMessage } from "@/features/shared/ui";
import { CheckCircle, XCircle, Zap, Award, Shield, Target } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useStats } from "@/features/shared/hooks";
import { ERROR_MESSAGES } from "@/lib/utils/constants";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const { user, isLoadingAuth } = useAuth();
    const { stats, isLoadingStats, statsError } = useStats();
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
                <FullPageLoader message="Завантаження..." />
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
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                                <Target className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-blue-300">
                                    Дашборд
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                            Ласкаво просимо,{" "}
                            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {user?.name || "Користувач"}
                            </span>
                            !
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300">
                            Відслідковуйте свій прогрес у розпізнаванні
                            фішингових атак
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                            <StatCard
                                label="Рейтинг"
                                value={stats.rating || 0}
                                icon={Award}
                                iconColor="text-blue-400"
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                            <StatCard
                                label="Всього листів"
                                value={stats.totalEmails || 0}
                                icon={Shield}
                                iconColor="text-cyan-400"
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                            <FeatureCard
                                title="Почни тренування"
                                description="Пройти через реалістичні симуляції фішингу та вивчити, як розпізнавати атаки."
                                icon={Zap}
                                iconColor="bg-blue-500/20"
                                linkHref="/simulation"
                                buttonText="Почати"
                            />
                        </div>
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <FeatureCard
                                title="Переглянути профіль"
                                description="Детальний аналіз вашого прогресу, рейтингу та історії симуляцій."
                                icon={Shield}
                                iconColor="bg-purple-500/20"
                                linkHref="/profile"
                                buttonText="Переглянути"
                                buttonVariant="outline"
                            />
                        </div>
                    </div>

                    <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
                        <InfoSection />
                    </div>
                </div>
            </main>
        </div>
    );
}
