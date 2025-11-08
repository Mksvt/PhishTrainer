"use client";

import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { WeeklyProgressData } from "@/lib/api/types";

interface ProgressChartProps {
    data: WeeklyProgressData[];
    isLoading: boolean;
}

export const ProgressChart = ({ data, isLoading }: ProgressChartProps) => {
    if (isLoading) {
        return (
            <Card className="p-3 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 overflow-hidden flex flex-col">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-foreground truncate">
                    Прогрес за тижнями
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Завантаження...
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="p-3 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 overflow-hidden flex flex-col">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-foreground truncate">
                    Прогрес за тижнями
                </h2>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                    Немає даних для відображення
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-3 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 overflow-hidden flex flex-col">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-foreground truncate">
                Прогрес за тижнями
            </h2>
            <div className="w-full overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6 flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                        />
                        <XAxis
                            dataKey="week"
                            stroke="var(--color-muted-foreground)"
                            tick={{ fontSize: 10 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            stroke="var(--color-muted-foreground)"
                            tick={{ fontSize: 10 }}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-card)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                color: "var(--color-foreground)",
                                fontSize: "12px",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                            type="monotone"
                            dataKey="correct"
                            stroke="var(--color-accent)"
                            name="Правильно"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="missed"
                            stroke="var(--color-primary)"
                            name="Пропущено"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="clicked"
                            stroke="var(--color-destructive)"
                            name="Попалися"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
