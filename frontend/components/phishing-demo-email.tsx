"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, AlertTriangle } from "lucide-react";

interface PhishingDemoEmailProps {
    email: {
        from: string;
        subject: string;
        preview: string;
        indicators: string[];
        danger: "high" | "medium" | "low";
    };
    isActive: boolean;
    onClick: () => void;
}

export function PhishingDemoEmail({
    email,
    isActive,
    onClick,
}: PhishingDemoEmailProps) {
    return (
        <Card
            className={`bg-white/5 border-white/10 backdrop-blur-md p-6 hover:bg-white/10 transition-all cursor-pointer hover:scale-105 ${
                isActive ? "ring-2 ring-cyan-500 scale-105 bg-white/10" : ""
            }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <Mail className="w-6 h-6 text-gray-400" />
                <Badge
                    variant={
                        email.danger === "high"
                            ? "destructive"
                            : email.danger === "medium"
                            ? "secondary"
                            : "outline"
                    }
                    className="text-xs"
                >
                    {email.danger === "high"
                        ? "⚠️ Висока загроза"
                        : email.danger === "medium"
                        ? "⚡ Середня загроза"
                        : "✓ Низька загроза"}
                </Badge>
            </div>

            <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Від:</div>
                <div className="text-sm text-gray-300 truncate font-mono bg-black/20 px-2 py-1 rounded">
                    {email.from}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Тема:</div>
                <div className="text-sm font-semibold text-white line-clamp-2">
                    {email.subject}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-xs text-gray-400 italic line-clamp-2 bg-gray-900/30 p-2 rounded">
                    {email.preview}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {email.indicators.map((indicator, i) => (
                    <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-red-500/30 text-red-400 bg-red-500/10"
                    >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {indicator}
                    </Badge>
                ))}
            </div>
        </Card>
    );
}
