"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/utils/constants";

interface AccuracyChartProps {
    correctIdentified: number;
    incorrectIdentified: number;
    scamsClicked: number;
}

export const AccuracyChart = ({
    correctIdentified,
    incorrectIdentified,
    scamsClicked,
}: AccuracyChartProps) => {
    const accuracyData = [
        { name: "Правильно", value: correctIdentified },
        { name: "Неправильно", value: incorrectIdentified },
        { name: "Попалися", value: scamsClicked },
    ];

    const COLORS = [
        CHART_COLORS.correct,
        CHART_COLORS.incorrect,
        CHART_COLORS.clicked,
    ];

    return (
        <Card className="p-3 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 overflow-hidden">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-foreground truncate">
                Розподіл результатів
            </h2>
            <div className="w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={accuracyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => {
                                const shortNames: Record<string, string> = {
                                    Правильно: "П",
                                    Неправильно: "Н",
                                    Попалися: "Х",
                                };
                                const isSmallScreen =
                                    typeof window !== "undefined" &&
                                    window.innerWidth < 640;
                                const displayName =
                                    typeof name === "string"
                                        ? isSmallScreen
                                            ? shortNames[name] ?? name
                                            : name
                                        : String(name ?? "");
                                return `${displayName}: ${value}`;
                            }}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-card)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                color: "var(--color-foreground)",
                                fontSize: "12px",
                            }}
                            formatter={(value: number) => value.toString()}
                            labelFormatter={(label: string) => {
                                const labels: { [key: string]: string } = {
                                    Правильно: "Правильно розпізнано",
                                    Неправильно: "Неправильно розпізнано",
                                    Попалися: "Попалися на фішинг",
                                };
                                return labels[label] || label;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.correct }}
                    ></div>
                    <span className="text-muted-foreground">Правильно</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.incorrect }}
                    ></div>
                    <span className="text-muted-foreground">Неправильно</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.clicked }}
                    ></div>
                    <span className="text-muted-foreground">Попалися</span>
                </div>
            </div>
        </Card>
    );
};
