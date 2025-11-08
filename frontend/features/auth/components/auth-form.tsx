"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InlineError } from "@/features/shared/ui/error-message";
import { Logo } from "@/features/shared/ui/logo";
import { useAuth } from "@/features/auth/hooks";
import {
    ERROR_MESSAGES,
    validatePasswordMatch,
    validatePassword,
} from "@/lib/utils/";

interface AuthFormProps {
    mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { login, register, isLoggingIn, isRegistering } = useAuth();
    const isLoading = mode === "login" ? isLoggingIn : isRegistering;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (mode === "signup") {
                if (!validatePasswordMatch(password, confirmPassword)) {
                    setError(ERROR_MESSAGES.PASSWORD_MISMATCH);
                    return;
                }

                if (!validatePassword(password)) {
                    setError(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
                    return;
                }

                await register({ email, name, password });
            } else {
                await login({ email, password });
            }
        } catch (err: unknown) {
            const apiError = err as { data?: { error?: string } };
            setError(
                apiError.data?.error ||
                    (mode === "login"
                        ? ERROR_MESSAGES.INVALID_CREDENTIALS
                        : ERROR_MESSAGES.REGISTRATION_ERROR)
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-background via-card to-background px-3 sm:px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                    <Logo size="lg" />
                </div>

                <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/50 border-border/50">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
                        {mode === "login" ? "Вхід" : "Реєстрація"}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                        {mode === "login"
                            ? "Введіть вашу електронну адресу та пароль"
                            : "Створіть акаунт, щоб розпочати навчання"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <InlineError message={error} />}

                        {mode === "signup" && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2 text-foreground">
                                    Ім'я
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше ім'я"
                                    className="w-full text-sm sm:text-base"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2 text-foreground">
                                Електронна адреса
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2 text-foreground">
                                Пароль
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full text-sm sm:text-base"
                                required
                            />
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2 text-foreground">
                                    Підтвердіть пароль
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full text-sm sm:text-base"
                                    required
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 h-10 sm:h-11 text-sm sm:text-base"
                        >
                            {isLoading
                                ? mode === "login"
                                    ? "Вхід..."
                                    : "Реєстрація..."
                                : mode === "login"
                                ? "Увійти"
                                : "Зареєструватися"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
                        {mode === "login" ? (
                            <>
                                Немає акаунту?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Зареєструйтеся
                                </Link>
                            </>
                        ) : (
                            <>
                                Вже маєте акаунт?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Увійти
                                </Link>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
