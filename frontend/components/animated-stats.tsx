"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface AnimatedStatsProps {
    value: string;
    label: string;
    icon: LucideIcon;
}

export function AnimatedStats({
    value,
    label,
    icon: Icon,
}: AnimatedStatsProps) {
    const [displayValue, setDisplayValue] = useState(value);

    // Перевірка чи потрібна анімація
    const shouldAnimate = /^\d+[+%]?$/.test(value); // Тільки для чисел з + або %
    const targetValue = shouldAnimate
        ? parseInt(value.replace(/\D/g, "")) || 0
        : 0;
    const suffix = shouldAnimate ? value.replace(/\d/g, "") : "";

    useEffect(() => {
        // Якщо не треба анімувати, просто показуємо значення
        if (!shouldAnimate) {
            setDisplayValue(value);
            return;
        }

        if (targetValue === 0) return;

        const duration = 2000;
        const steps = 60;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                setDisplayValue(`${targetValue}${suffix}`);
                clearInterval(timer);
            } else {
                setDisplayValue(`${Math.floor(current)}${suffix}`);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [targetValue, suffix, shouldAnimate, value]);

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md p-6 hover:bg-white/10 transition-all hover:scale-105">
            <div className="flex flex-col items-center gap-2">
                <Icon className="w-8 h-8 text-cyan-400" />
                <div className="text-3xl font-bold text-white">
                    {displayValue}
                </div>
                <div className="text-sm text-gray-400">{label}</div>
            </div>
        </Card>
    );
}
