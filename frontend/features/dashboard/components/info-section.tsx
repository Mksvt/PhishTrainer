"use client";

import { Card } from "@/components/ui/card";

interface InfoSectionItem {
    step: number;
    title: string;
    description: string;
}

const infoItems: InfoSectionItem[] = [
    {
        step: 1,
        title: "Отримайте реалістичні листи",
        description:
            "Платформа генерує автентичні фішингові листи та легітимні повідомлення. Листи не повторюються часто для різноманітності.",
    },
    {
        step: 2,
        title: "Прийміть рішення",
        description:
            "Проаналізуйте кожний лист та виберіть: це фішинг чи легітимне повідомлення?",
    },
    {
        step: 3,
        title: "Отримайте детальні пояснення",
        description:
            "Explainable AI розповідає, чому це лист був/не був фішингом та як його розпізнати.",
    },
];

export const InfoSection = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-white">
                Як це працює?
            </h2>
            <div className="space-y-4">
                {infoItems.map((item) => (
                    <div key={item.step} className="flex gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md" />
                            <div className="relative w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 text-white font-bold">
                                {item.step}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">
                                {item.title}
                            </h4>
                            <p className="text-gray-300">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
