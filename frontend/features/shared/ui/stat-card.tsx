import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
}

export const StatCard = ({
    label,
    value,
    icon: Icon,
    iconColor = "text-foreground/30",
}: StatCardProps) => {
    return (
        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                        {value}
                    </p>
                </div>
                <Icon
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} shrink-0`}
                />
            </div>
        </Card>
    );
};
