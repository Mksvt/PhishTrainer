"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { useRegisterMutation } from "@/lib/api/apiSlice";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const [register, { isLoading }] = useRegisterMutation();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Паролі не збігаються");
            return;
        }

        if (password.length < 6) {
            setError("Пароль повинен містити мінімум 6 символів");
            return;
        }

        console.log("Attempting registration with:", { email, name });

        try {
            const response = await register({ email, name, password }).unwrap();

            console.log("Успішна реєстрація:", response);
            console.log("User:", response.user);
            console.log("Token:", response.token);

            // Даємо час на збереження cookie
            await new Promise((resolve) => setTimeout(resolve, 100));

            console.log("Redirecting to dashboard...");

            // Використовуємо window.location для гарантованого редіректу
            window.location.href = "/dashboard";
        } catch (err: any) {
            console.error("Помилка реєстрації:", err);
            setError(
                err.data?.error || "Помилка при реєстрації. Спробуйте пізніше."
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-card to-background px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        PhishTrainer
                    </h1>
                </div>

                <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50">
                    <h2 className="text-2xl font-bold mb-2 text-foreground">
                        Реєстрація
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Створіть акаунт, щоб розпочати навчання
                    </p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Ім'я
                            </label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ваше ім'я"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Електронна адреса
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Пароль
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Підтвердіть пароль
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 h-11"
                        >
                            {isLoading ? "Реєстрація..." : "Зареєструватися"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Вже маєте акаунт?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline font-medium"
                        >
                            Увійти
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
