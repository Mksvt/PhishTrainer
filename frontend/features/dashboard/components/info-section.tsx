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
        <Card className="p-8 backdrop-blur-sm bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
                Як це працює?
            </h2>
            <div className="space-y-4 text-muted-foreground">
                {infoItems.map((item) => (
                    <div key={item.step} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0 text-primary font-bold">
                            {item.step}
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">
                                {item.title}
                            </h4>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
