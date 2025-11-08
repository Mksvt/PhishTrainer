"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FeatureItemProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
}

export const FeatureItem = ({
    title,
    description,
    icon: Icon,
    iconColor,
}: FeatureItemProps) => {
    return (
        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
            <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${iconColor} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}
            >
                <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor.replace(
                        "/20",
                        ""
                    )}`}
                />
            </div>
            <h3 className="font-bold mb-2 text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
            </p>
        </Card>
    );
};

interface HeroSectionProps {
    isLoggedIn: boolean;
}

export const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
    return (
        <section className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center">
            <div className="mb-6 sm:mb-8 inline-block">
                <span className="px-3 sm:px-4 py-2 bg-secondary/20 text-secondary rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
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
                {isLoggedIn ? (
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-base sm:text-lg h-11 sm:h-12 w-full"
                        >
                            Перейти до дашборду
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-base sm:text-lg h-11 sm:h-12 w-full"
                            >
                                Почати навчання
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base sm:text-lg h-11 sm:h-12 bg-transparent w-full sm:w-auto"
                        >
                            Дізнатись більше
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
};
