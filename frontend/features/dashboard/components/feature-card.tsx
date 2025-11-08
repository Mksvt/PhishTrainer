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
        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
                <div
                    className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center shrink-0`}
                >
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{description}</p>
                    <Link href={linkHref}>
                        <Button
                            variant={buttonVariant}
                            className={
                                buttonVariant === "default"
                                    ? "bg-primary hover:bg-primary/90 gap-2"
                                    : "gap-2 bg-transparent"
                            }
                        >
                            {buttonText}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};
