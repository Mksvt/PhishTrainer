"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, User } from "lucide-react";
import { useLogoutMutation, useGetProfileQuery } from "@/lib/api/apiSlice";

const isDev = process.env.NODE_ENV === "development";

export function Navbar() {
    const router = useRouter();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    
    // Отримуємо дані користувача через API
    const { data: profileData } = useGetProfileQuery();
    const user = profileData?.user;

    const handleLogout = async () => {
        try {
            if (isDev) {
                console.log("Logging out...");
            }

            await logout().unwrap();

            if (isDev) {
                console.log("Redirecting to home...");
            }

            router.push("/");
        } catch (error) {
            if (isDev) {
                console.error("Logout error:", error);
            }

            // Якщо logout запит провалився, все одно перенаправляємо
            router.push("/");
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
                            disabled={isLoggingOut}
                            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isLoggingOut ? "Вихід..." : "Вихід"}
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
