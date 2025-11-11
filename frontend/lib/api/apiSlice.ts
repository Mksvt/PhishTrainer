import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_URL } from "../utils/constants";
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

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers) => headers,
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const errorData = result.error.data as any;

        if (errorData?.code === "TOKEN_EXPIRED") {
            console.log("Access token expired, trying to refresh...");

            const refreshResult = await baseQuery(
                {
                    url: "/auth/refresh",
                    method: "POST",
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                console.log(
                    "Token refreshed successfully, retrying request..."
                );
                result = await baseQuery(args, api, extraOptions);
            } else {
                window.location.href = "/login";
            }
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Stats", "Emails", "History"],
    endpoints: (builder) => ({
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
                const limit = params?.limit || 50;
                const offset = params?.offset || 0;
                return `/simulation/history?limit=${limit}&offset=${offset}`;
            },
            providesTags: ["History"],
        }),

        getWeeklyProgress: builder.query<
            { weeklyProgress: WeeklyProgressData[] },
            { weeks?: number } | void
        >({
            query: (params) => {
                const weeks = params?.weeks || 4;
                return `/simulation/weekly-progress?weeks=${weeks}`;
            },
            providesTags: ["Stats"],
        }),
    }),
});

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
