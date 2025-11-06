// API Client для PhishTrainer Backend
// Використовуйте цей файл для підключення frontend до backend API

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Отримання токену з localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Базовий fetch з автентифікацією
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers = new Headers(options.headers as HeadersInit);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (data: { email: string; name: string; password: string }) => {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Зберігаємо токен
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Зберігаємо токен
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  getProfile: async () => {
    return apiFetch('/auth/profile');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Email API
export const emailAPI = {
  getAll: async () => {
    return apiFetch('/emails');
  },

  getRandom: async () => {
    return apiFetch('/emails/random');
  },

  getById: async (id: string) => {
    return apiFetch(`/emails/${id}`);
  },
};

// Simulation API
export const simulationAPI = {
  checkAnswer: async (data: { emailId: string; userAnswer: boolean }) => {
    return apiFetch('/simulation/check', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return apiFetch('/simulation/stats');
  },

  getHistory: async (params?: { limit?: number; offset?: number }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : '';
    return apiFetch(`/simulation/history${queryString}`);
  },
};

// Export all
export default {
  auth: authAPI,
  email: emailAPI,
  simulation: simulationAPI,
};
