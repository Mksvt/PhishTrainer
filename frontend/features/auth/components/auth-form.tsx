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
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 px-3 sm:px-4">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            PhishTrainer
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Next-Gen Security Training
                        </p>
                    </div>
                </div>

                <Card className="p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-white/10">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                        {mode === "login" ? "Вхід" : "Реєстрація"}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 mb-6">
                        {mode === "login"
                            ? "Введіть вашу електронну адресу та пароль"
                            : "Створіть акаунт, щоб розпочати навчання"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <InlineError message={error} />}

                        {mode === "signup" && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">
                                    Ім'я
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше ім'я"
                                    className="w-full text-sm sm:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">
                                Електронна адреса
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full text-sm sm:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">
                                Пароль
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full text-sm sm:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                required
                            />
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">
                                    Підтвердіть пароль
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full text-sm sm:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50 h-10 sm:h-11 text-sm sm:text-base"
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

                    <div className="mt-6 text-center text-xs sm:text-sm text-gray-300">
                        {mode === "login" ? (
                            <>
                                Немає акаунту?{" "}
                                <Link
                                    href="/signup"
                                    className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                                >
                                    Зареєструйтеся
                                </Link>
                            </>
                        ) : (
                            <>
                                Вже маєте акаунт?{" "}
                                <Link
                                    href="/login"
                                    className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
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
