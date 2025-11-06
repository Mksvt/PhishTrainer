import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Базовий query з автентифікацією
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Stats', 'Emails', 'History'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Register error:', error);
        }
      },
      invalidatesTags: ['User', 'Stats'],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      },
      invalidatesTags: ['User', 'Stats'],
    }),

    getProfile: builder.query<
      { user: ApiUser & { stats: ApiUserStats } },
      void
    >({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    // Email endpoints
    getAllEmails: builder.query<{ emails: ApiEmail[] }, void>({
      query: () => '/emails',
      providesTags: ['Emails'],
    }),

    getRandomEmail: builder.query<{ email: ApiEmail }, void>({
      query: () => '/emails/random',
    }),

    getEmailById: builder.query<{ email: ApiEmail }, string>({
      query: (id) => `/emails/${id}`,
    }),

    // Simulation endpoints
    checkAnswer: builder.mutation<CheckAnswerResponse, CheckAnswerRequest>({
      query: (data) => ({
        url: '/simulation/check',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stats', 'History'],
    }),

    getUserStats: builder.query<{ stats: ApiUserStats }, void>({
      query: () => '/simulation/stats',
      providesTags: ['Stats'],
    }),

    getUserAnswerHistory: builder.query<
      { answers: ApiUserAnswer[] },
      { limit?: number; offset?: number } | void
    >({
      query: (params) => {
        const queryParams = params
          ? `?limit=${params.limit || 50}&offset=${params.offset || 0}`
          : '';
        return `/simulation/history${queryParams}`;
      },
      providesTags: ['History'],
    }),
  }),
});

// Export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useGetAllEmailsQuery,
  useGetRandomEmailQuery,
  useGetEmailByIdQuery,
  useCheckAnswerMutation,
  useGetUserStatsQuery,
  useGetUserAnswerHistoryQuery,
} = apiSlice;
