"use client";

import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, AlertCircle } from "lucide-react";
import { ACCURACY_LEVELS } from "@/lib/utils/constants";

interface AchievementStatusProps {
    accuracy: number;
}

export const AchievementStatus = ({ accuracy }: AchievementStatusProps) => {
    const isExpert = accuracy >= ACCURACY_LEVELS.EXPERT;
    const isGood =
        accuracy >= ACCURACY_LEVELS.GOOD && accuracy < ACCURACY_LEVELS.EXPERT;
    const isBeginner = accuracy < ACCURACY_LEVELS.GOOD;

    return (
        <Card className="p-4 sm:p-8 backdrop-blur-sm bg-linear-to-r from-secondary/10 to-primary/10 border border-secondary/20">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                Поточна позиція
            </h2>

            {isExpert && (
                <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-accent mt-1 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base text-foreground">
                            Експерт з безпеки!
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Ви досягли 80%+ точності. Продовжуйте тренування для
                            утримання навичок.
                        </p>
                    </div>
                </div>
            )}

            {isGood && (
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base text-foreground">
                            Добрий прогрес!
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Ви на правильному шляху. Ще{" "}
                            {ACCURACY_LEVELS.EXPERT - accuracy}% до статусу
                            експерта. Продовжуйте!
                        </p>
                    </div>
                </div>
            )}

            {isBeginner && (
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-1 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base text-foreground">
                            Потрібна практика
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Здається, фішинги вас часто обманюють. Проведіть
                            більше симуляцій для покращення навичок
                            розпізнавання.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};
