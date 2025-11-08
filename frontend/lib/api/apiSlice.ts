import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    ApiUser,
    ApiUserStats,
    ApiEmail,
    CheckAnswerRequest,
    CheckAnswerResponse,
    ApiUserAnswer,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    WeeklyProgressData,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Базовий query з автентифікацією через cookies
const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include", // Важливо для відправки cookies
    prepareHeaders: (headers) => {
        // Токени тепер в HttpOnly cookies, не потрібно додавати вручну
        return headers;
    },
});

// API slice
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["User", "Stats", "Emails", "History"],
    endpoints: (builder) => ({
        // Auth endpoints
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User", "Stats"],
        }),

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User", "Stats"],
        }),

        getProfile: builder.query<
            { user: ApiUser & { stats: ApiUserStats } },
            void
        >({
            query: () => "/auth/profile",
            providesTags: ["User"],
        }),

        logout: builder.mutation<{ message: string; success: boolean }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User", "Stats", "History"],
        }),

        // Email endpoints
        getAllEmails: builder.query<{ emails: ApiEmail[] }, void>({
            query: () => "/emails",
            providesTags: ["Emails"],
        }),

        getRandomEmail: builder.query<{ email: ApiEmail }, void>({
            query: () => "/emails/random",
        }),

        getEmailById: builder.query<{ email: ApiEmail }, string>({
            query: (id) => `/emails/${id}`,
        }),

        getEmailHistory: builder.query<
            { emails: ApiEmail[]; count: number },
            void
        >({
            query: () => "/emails/history",
            providesTags: ["History"],
        }),

        clearEmailHistory: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/emails/history",
                method: "DELETE",
            }),
            invalidatesTags: ["History"],
        }),

        // Simulation endpoints
        checkAnswer: builder.mutation<CheckAnswerResponse, CheckAnswerRequest>({
            query: (data) => ({
                url: "/simulation/check",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stats", "History"],
        }),

        getUserStats: builder.query<{ stats: ApiUserStats }, void>({
            query: () => "/simulation/stats",
            providesTags: ["Stats"],
        }),

        getUserAnswerHistory: builder.query<
            { answers: ApiUserAnswer[] },
            { limit?: number; offset?: number } | void
        >({
            query: (params) => {
                const queryParams = params
                    ? `?limit=${params.limit || 50}&offset=${
                          params.offset || 0
                      }`
                    : "";
                return `/simulation/history${queryParams}`;
            },
            providesTags: ["History"],
        }),

        getWeeklyProgress: builder.query<
            { weeklyProgress: WeeklyProgressData[] },
            { weeks?: number } | void
        >({
            query: (params) => {
                const queryParams = params?.weeks
                    ? `?weeks=${params.weeks}`
                    : "";
                return `/simulation/weekly-progress${queryParams}`;
            },
            providesTags: ["Stats"],
        }),
    }),
});

// Export hooks
export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useGetAllEmailsQuery,
    useGetRandomEmailQuery,
    useGetEmailByIdQuery,
    useGetEmailHistoryQuery,
    useClearEmailHistoryMutation,
    useCheckAnswerMutation,
    useGetUserStatsQuery,
    useGetUserAnswerHistoryQuery,
    useGetWeeklyProgressQuery,
} = apiSlice;
