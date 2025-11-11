import { Brain, Target, BarChart3, Award, Lock, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
}

export const LANDING_FEATURES: FeatureItem[] = [
    {
        icon: Brain,
        title: "AI-аналіз в реальному часі",
        description:
            "Розумна система аналізує фішингові ознаки та пояснює кожен елемент загрози детально",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Target,
        title: "Інтерактивні симуляції",
        description:
            "Практикуйтесь на реалістичних прикладах фішингових атак різних типів та складності",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: BarChart3,
        title: "Детальна аналітика",
        description:
            "Відстежуйте свій прогрес, статистику та досягнення у зручному дашборді",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: Award,
        title: "Система досягнень",
        description:
            "Отримуйте нагороди за прогрес, змагайтесь з іншими та підвищуйте свій рівень",
        gradient: "from-orange-500 to-red-500",
    },
    {
        icon: Lock,
        title: "Безпечне середовище",
        description:
            "Навчайтесь без ризику для реальних даних у повністю контрольованому середовищі",
        gradient: "from-indigo-500 to-blue-500",
    },
    {
        icon: Zap,
        title: "Миттєвий фідбек",
        description:
            "Отримуйте пояснення помилок та рекомендації одразу після кожної відповіді",
        gradient: "from-yellow-500 to-orange-500",
    },
];
