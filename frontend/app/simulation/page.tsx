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
import { History, RotateCcw } from "lucide-react";
import { useSimulation, useEmailHistory } from "@/features/simulation/hooks";

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

    const handleClearAndReset = async () => {
        await handleClearHistory();
        resetSimulation();
        fetchNewEmail();
    };

    if (isLoadingEmail || !currentEmail) {
        return (
            <>
                <Navbar />
                <FullPageLoader message="Завантаження листа..." />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-linear-to-br from-background via-card to-background">
                <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Симуляція поштової скриньки
                            </h1>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewHistory}
                                    className="text-xs sm:text-sm gap-2"
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
                                        className="text-xs sm:text-sm gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {isClearingHistory
                                            ? "Скидання..."
                                            : "Скинути"}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs sm:text-base text-muted-foreground">
                            Проаналізуйте лист: це фішинг чи легітимне
                            повідомлення?
                        </p>
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
                        <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">
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

                    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
                        <h3 className="font-bold text-foreground mb-3">
                            Підказки:
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {PHISHING_TIPS.map((tip, index) => (
                                <li key={index}>• {tip}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </main>
        </>
    );
}
