"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    EmailCard,
    EmailDecision,
    EmailFeedback,
    EmailHistoryModal,
} from "@/features/simulation/components";
import { FullPageLoader } from "@/features/shared/ui";
import { History, RotateCcw, Mail, AlertTriangle } from "lucide-react";
import { useSimulation, useEmailHistory } from "@/features/simulation/hooks";
import { useState, useEffect } from "react";

const PHISHING_TIPS = [
    "Завжди перевіряйте адресу відправника і домен посилань",
    "Спеціальна паніка та мовні помилки - сигнали фішингу",
    "Офіційні компанії ніколи не просять паролі або конфіденційні дані емейлом",
    "Посилання на невірні адреси офіційних посилань завжди шахрайство",
];

export default function SimulationPage() {
    const {
        currentEmail,
        showFeedback,
        feedbackData,
        emailCount,
        isLoadingEmail,
        isCheckingAnswer,
        handleAnswer,
        handleNext,
        fetchNewEmail,
        resetSimulation,
    } = useSimulation();

    const {
        emailHistory,
        showHistory,
        isLoadingHistory,
        isClearingHistory,
        handleViewHistory,
        handleClearHistory,
        setShowHistory,
    } = useEmailHistory();

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClearAndReset = async () => {
        await handleClearHistory();
        resetSimulation();
        fetchNewEmail();
    };

    if (isLoadingEmail || !currentEmail) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
                </div>
                <Navbar />
                <FullPageLoader message="Завантаження листа..." />
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
                <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                                <div className="inline-block mb-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm">
                                        <Mail className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm text-purple-300">
                                            Симуляція
                                        </span>
                                    </div>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                    Симуляція{" "}
                                    <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        поштової скриньки
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-gray-300">
                                    Проаналізуйте лист: це фішинг чи легітимне
                                    повідомлення?
                                </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewHistory}
                                    className="flex-1 sm:flex-none text-xs sm:text-sm gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
                                >
                                    <History className="w-4 h-4" />
                                    Історія
                                </Button>
                                {emailCount > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearAndReset}
                                        disabled={isClearingHistory}
                                        className="flex-1 sm:flex-none text-xs sm:text-sm gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {isClearingHistory
                                            ? "Скидання..."
                                            : "Скинути"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {showHistory && (
                        <EmailHistoryModal
                            emails={emailHistory}
                            isLoading={isLoadingHistory}
                            onClose={() => setShowHistory(false)}
                        />
                    )}

                    <EmailCard email={currentEmail} />

                    {!showFeedback && (
                        <Card className="p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-white/10 mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">
                                Який ваш вердикт?
                            </h2>
                            <EmailDecision
                                onAnswer={handleAnswer}
                                isDisabled={isCheckingAnswer}
                            />
                        </Card>
                    )}

                    {showFeedback && feedbackData && (
                        <EmailFeedback
                            feedback={feedbackData}
                            onNext={handleNext}
                        />
                    )}

                    <Card className="p-6 backdrop-blur-md bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            <h3 className="font-bold text-white">Підказки:</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-300">
                            {PHISHING_TIPS.map((tip, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-cyan-400 mt-0.5">
                                        •
                                    </span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </main>
        </div>
    );
}
