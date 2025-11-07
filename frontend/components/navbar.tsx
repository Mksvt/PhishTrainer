"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, User } from "lucide-react";
import { useLogoutMutation } from "@/lib/api/apiSlice";

export function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        try {
            console.log("Logging out...");
            await logout().unwrap();

            setUser(null);
            console.log("Redirecting to login...");

            // Використовуємо window.location для гарантованого редіректу
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            // Навіть якщо є помилка, все одно очищаємо локальні дані
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            document.cookie =
                "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            setUser(null);
            window.location.href = "/";
        }
    };

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and Title - Routes to / */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-foreground hidden sm:inline">
                        PhishTrainer
                    </span>
                </Link>

                {/* Center Navigation - Dashboard and Simulation */}
                {user && (
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-foreground hover:bg-foreground/10 hover:text-foreground"
                            >
                                Дашборд
                            </Button>
                        </Link>
                        <Link href="/simulation">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-foreground hover:bg-foreground/10 hover:text-foreground"
                            >
                                Симуляція
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Right Side - Profile and Logout */}
                {user && (
                    <div className="flex items-center gap-3">
                        <Link href="/profile">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-foreground hover:bg-foreground/10 hover:text-foreground"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {user.name}
                                </span>
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isLoading ? "Вихід..." : "Вихід"}
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
