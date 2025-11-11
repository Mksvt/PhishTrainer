"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    linkHref: string;
    buttonText: string;
    buttonVariant?: "default" | "outline";
}

export const FeatureCard = ({
    title,
    description,
    icon: Icon,
    iconColor,
    linkHref,
    buttonText,
    buttonVariant = "default",
}: FeatureCardProps) => {
    return (
        <div className="flex items-start gap-4">
            <div
                className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center shrink-0`}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-300 mb-4">{description}</p>
                <Link href={linkHref}>
                    <Button
                        variant={buttonVariant}
                        className={
                            buttonVariant === "default"
                                ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50 gap-2"
                                : "gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white"
                        }
                    >
                        {buttonText}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};
