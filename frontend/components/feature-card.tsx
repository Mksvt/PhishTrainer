"use client";

import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    delay?: number;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    gradient,
    delay = 0,
}: FeatureCardProps) {
    return (
        <Card
            className="bg-white/5 border-white/10 backdrop-blur-md p-8 hover:bg-white/10 transition-all group cursor-pointer hover:scale-105"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div
                className={`w-16 h-16 bg-linear-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}
            >
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                {title}
            </h4>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </Card>
    );
}
