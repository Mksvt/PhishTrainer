// API Types для RTK Query
export interface ApiUser {
    id: string;
    email: string;
    name: string;
}

export interface ApiUserStats {
    id: string;
    userId: string;
    rating: number;
    totalEmails: number;
    correctIdentified: number;
    incorrectIdentified: number;
    scamsClicked: number;
    accuracy?: number;
    level?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiEmail {
    id: string;
    subject: string;
    from: string;
    body: string;
    difficulty: "easy" | "medium" | "hard";
    category: string;
}

export interface CheckAnswerRequest {
    emailId: string;
    userAnswer: boolean;
}

export interface CheckAnswerResponse {
    isCorrect: boolean;
    correctAnswer: boolean;
    indicators: string[];
    explanation: string;
    message: string;
}

export interface ApiUserAnswer {
    id: string;
    userId: string;
    emailId: string;
    userAnswer: boolean;
    isCorrect: boolean;
    answeredAt: string;
    email?: {
        subject: string;
        from: string;
        category: string;
        difficulty: string;
    };
}

export interface AuthResponse {
    message: string;
    token: string;
    user: ApiUser & { stats: ApiUserStats };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface WeeklyProgressData {
    week: string;
    correct: number;
    missed: number;
    clicked: number;
}
