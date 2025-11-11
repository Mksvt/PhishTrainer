import { Mail, Brain, Target, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StatItem {
    value: string;
    label: string;
    icon: LucideIcon;
}

export const LANDING_STATS: StatItem[] = [
    { value: "1000+", label: "Сценаріїв атак", icon: Mail },
    { value: "95%", label: "Точність AI", icon: Brain },
    { value: "10+", label: "Категорій загроз", icon: Target },
    { value: "24/7", label: "Доступність", icon: Globe },
];
