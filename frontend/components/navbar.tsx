"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";

export function Navbar() {
    const { user, logout, isLoggingOut } = useAuth();

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-foreground hidden sm:inline">
                        PhishTrainer
                    </span>
                </Link>

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
                            onClick={logout}
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
