import { Users, Search, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WorkflowStep {
    step: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
    {
        step: "01",
        title: "Реєстрація",
        description: "Створіть безкоштовний акаунт за 30 секунд",
        icon: Users,
    },
    {
        step: "02",
        title: "Аналіз листів",
        description: "Аналізуйте фішингові листи з AI-підказками",
        icon: Search,
    },
    {
        step: "03",
        title: "Відстеження прогресу",
        description: "Отримуйте детальну статистику та досягнення",
        icon: TrendingUp,
    },
];
