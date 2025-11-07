"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
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
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Trophy, TrendingUp, AlertCircle } from "lucide-react";
import {
    useGetUserStatsQuery,
    useGetWeeklyProgressQuery,
} from "@/lib/api/apiSlice";

export default function ProfilePage() {
    const router = useRouter();

    // RTK Query hooks
    const { data: statsData, isLoading, error } = useGetUserStatsQuery();
    const { data: weeklyData, isLoading: isWeeklyLoading } =
        useGetWeeklyProgressQuery({ weeks: 4 });

    useEffect(() => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;
        if (!token) {
            router.push("/login");
            return;
        }
    }, [router]);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Завантаження статистики...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !statsData) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center text-destructive">
                        <p>Помилка завантаження статистики</p>
                    </div>
                </div>
            </>
        );
    }

    const stats = statsData.stats;
    const userData =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : {};

    const accuracy =
        stats.totalEmails > 0
            ? Math.round((stats.correctIdentified / stats.totalEmails) * 100)
            : 0;

    // Перетворюємо дані для графіка
    const performanceData = weeklyData?.weeklyProgress || [];

    const accuracyData = [
        { name: "Правильно", value: stats.correctIdentified || 0 },
        { name: "Неправильно", value: stats.incorrectIdentified || 0 },
        { name: "Попалися", value: stats.scamsClicked || 0 },
    ];

    const COLORS = ["#65f741", "#ff6b6b", "#ff9800"];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-linear-to-br from-background via-card to-background">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4">
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 wrap-break-word">
                                    {userData.name || "Користувач"}
                                </h1>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {userData.email || ""}
                                </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                    Загальний рейтинг
                                </p>
                                <div className="flex sm:justify-end items-center gap-2">
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                                        {stats.rating || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                Точність
                            </p>
                            <p className="text-xl sm:text-3xl font-bold text-primary">
                                {stats.accuracy || 0}%
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                                {stats.totalEmails || 0} листів
                            </p>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                Розпізнано
                            </p>
                            <p className="text-xl sm:text-3xl font-bold text-accent">
                                {stats.correctIdentified || 0}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                                Правильних
                            </p>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                На них впали
                            </p>
                            <p className="text-xl sm:text-3xl font-bold text-destructive">
                                {stats.scamsClicked || 0}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                                Помилки
                            </p>
                        </Card>

                        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                                Рівень
                            </p>
                            <p className="text-xl sm:text-3xl font-bold text-secondary">
                                {stats.level || 1}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                                Фахівець
                            </p>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 min-h-[400px] lg:min-h-[500px]">
                        {/* Performance Chart */}
                        <Card className="p-3 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 overflow-hidden flex flex-col">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-foreground truncate">
                                Прогрес за тижнями
                            </h2>
                            {isWeeklyLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Завантаження...
                                        </p>
                                    </div>
                                </div>
                            ) : performanceData.length > 0 ? (
                                <div className="w-full overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6 flex-1">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                        minWidth={300}
                                    >
                                        <LineChart
                                            data={performanceData}
                                            margin={{
                                                top: 5,
                                                right: 10,
                                                left: 0,
                                                bottom: 5,
                                            }}
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
                                                    backgroundColor:
                                                        "var(--color-card)",
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "8px",
                                                    color: "var(--color-foreground)",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    fontSize: "12px",
                                                }}
                                            />
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
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                                    Немає даних для відображення
                                </div>
                            )}
                        </Card>

                        {/* Accuracy Pie Chart */}
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
                                                // На малих екранах показуємо скорочені назви
                                                const shortNames: Record<
                                                    string,
                                                    string
                                                > = {
                                                    Правильно: "П",
                                                    Неправильно: "Н",
                                                    Попалися: "Х",
                                                };
                                                const isSmallScreen =
                                                    typeof window !==
                                                        "undefined" &&
                                                    window.innerWidth < 640;

                                                let displayName: string;
                                                if (typeof name === "string") {
                                                    displayName = isSmallScreen
                                                        ? shortNames[name] ??
                                                          name
                                                        : name;
                                                } else {
                                                    displayName = String(
                                                        name ?? ""
                                                    );
                                                }
                                                return `${displayName}: ${value}`;
                                            }}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {COLORS.map((color, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    "var(--color-card)",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: "8px",
                                                color: "var(--color-foreground)",
                                                fontSize: "12px",
                                            }}
                                            formatter={(value: any) =>
                                                value.toString()
                                            }
                                            labelFormatter={(label: any) => {
                                                const labels: {
                                                    [key: string]: string;
                                                } = {
                                                    Правильно:
                                                        "Правильно розпізнано",
                                                    Неправильно:
                                                        "Неправильно розпізнано",
                                                    Попалися:
                                                        "Попалися на фішинг",
                                                };
                                                return labels[label] || label;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Legend */}
                            <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: "#65f741" }}
                                    ></div>
                                    <span className="text-muted-foreground">
                                        Правильно
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: "#ff6b6b" }}
                                    ></div>
                                    <span className="text-muted-foreground">
                                        Неправильно
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: "#ff9800" }}
                                    ></div>
                                    <span className="text-muted-foreground">
                                        Попалися
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Achievements or Tips */}
                    <Card className="p-4 sm:p-8 backdrop-blur-sm bg-linear-to-r from-secondary/10 to-primary/10 border border-secondary/20">
                        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
                            Поточна позиція
                        </h2>

                        {(stats.accuracy || 0) >= 80 && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Trophy className="w-5 h-5 text-accent mt-1 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm sm:text-base text-foreground">
                                            Експерт з безпеки!
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Ви досягли 80%+ точності.
                                            Продовжуйте тренування для утримання
                                            навичок.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(stats.accuracy || 0) < 80 &&
                            (stats.accuracy || 0) >= 50 && (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="w-5 h-5 text-primary mt-1 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm sm:text-base text-foreground">
                                                Добрий прогрес!
                                            </p>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                Ви на правильному шляху. Ще{" "}
                                                {80 - (stats.accuracy || 0)}% до
                                                статусу експерта. Продовжуйте!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {(stats.accuracy || 0) < 50 && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-destructive mt-1 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm sm:text-base text-foreground">
                                            Потрібна практика
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Здається, фішинги вас часто
                                            обманюють. Проведіть більше
                                            симуляцій для покращення навичок
                                            розпізнавання.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </>
    );
}
