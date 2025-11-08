import {
    useGetUserStatsQuery,
    useGetWeeklyProgressQuery,
} from "@/lib/api/apiSlice";

export const useStats = () => {
    const { data: statsData, isLoading, error } = useGetUserStatsQuery();

    return {
        stats: statsData?.stats,
        isLoadingStats: isLoading,
        statsError: error,
    };
};

export const useWeeklyProgress = (weeks: number = 4) => {
    const { data: weeklyData, isLoading } = useGetWeeklyProgressQuery({
        weeks,
    });

    return {
        weeklyProgress: weeklyData?.weeklyProgress || [],
        isLoadingWeekly: isLoading,
    };
};
