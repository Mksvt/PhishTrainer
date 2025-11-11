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
            <div className="flex flex-col h-full">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-white truncate">
                    Прогрес за тижнями
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-gray-400">
                            Завантаження...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-white truncate">
                    Прогрес за тижнями
                </h2>
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                    Немає даних для відображення
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-white truncate">
                Прогрес за тижнями
            </h2>
            <div className="w-full overflow-x-auto flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                            dataKey="week"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{
                                fontSize: 10,
                                fill: "rgba(255,255,255,0.7)",
                            }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{
                                fontSize: 10,
                                fill: "rgba(255,255,255,0.7)",
                            }}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "12px",
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px", color: "white" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="correct"
                            stroke="#22d3ee"
                            name="Правильно"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="missed"
                            stroke="#3b82f6"
                            name="Пропущено"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="clicked"
                            stroke="#ef4444"
                            name="Попалися"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
