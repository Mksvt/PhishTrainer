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
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                    {value}
                </p>
            </div>
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} shrink-0`} />
        </div>
    );
};
