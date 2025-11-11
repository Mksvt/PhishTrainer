"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";

export function Navbar() {
    const { user, logout, isLoggingOut } = useAuth();

    return (
        <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg blur-sm opacity-50" />
                        <div className="relative w-10 h-10 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center p-1.5">
                            <Image
                                src="/logo.svg"
                                alt="PhishTrainer Logo"
                                width={24}
                                height={24}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                    <span className="font-bold text-white hidden sm:inline">
                        PhishTrainer
                    </span>
                </Link>

                {user && (
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:bg-white/10 hover:text-white"
                            >
                                Дашборд
                            </Button>
                        </Link>
                        <Link href="/simulation">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:bg-white/10 hover:text-white"
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
                                className="gap-2 text-gray-300 hover:bg-white/10 hover:text-white"
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
                            className="gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
