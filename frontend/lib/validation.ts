// Типи даних користувача

export interface User {
    id: string;
    email: string;
    name: string;
    stats?: UserStats;
}

export interface UserStats {
    id: string;
    userId: string;
    rating: number;
    totalEmails: number;
    correctIdentified: number;
    incorrectIdentified: number;
    scamsClicked: number;
}
