"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Rocket,
    Eye,
    CheckCircle2,
    Sparkles,
    Target,
    Zap,
    ArrowRight,
} from "lucide-react";
import { useGetProfileQuery } from "@/lib/api/apiSlice";
import { useState, useEffect } from "react";
import { AnimatedStats } from "@/components/animated-stats";
import { PhishingDemoEmail } from "@/components/phishing-demo-email";
import { FeatureCard } from "@/components/feature-card";
import {
    LANDING_STATS,
    LANDING_FEATURES,
    DEMO_PHISHING_EMAILS,
    WORKFLOW_STEPS,
} from "@/constants";

export default function Home() {
    const { data: profileData } = useGetProfileQuery();
    const isLoggedIn = !!profileData?.user;

    const [scrollY, setScrollY] = useState(0);
    const [activeDemo, setActiveDemo] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDemo(
                (prev: number) => (prev + 1) % DEMO_PHISHING_EMAILS.length
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                />
                <div
                    className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                />
                <div
                    className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between backdrop-blur-md bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50" />
                            <div className="relative w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center p-2">
                                <Image
                                    src="/logo.svg"
                                    alt="PhishTrainer Logo"
                                    width={32}
                                    height={32}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                PhishTrainer
                            </h1>
                            <p className="text-xs text-gray-400">
                                Next-Gen Security Training
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isLoggedIn ? (
                            <Link href="/dashboard">
                                <Button className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50">
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Дашборд
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-black hover:bg-white/10 hidden sm:flex"
                                    >
                                        Вхід
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50">
                                        Почати
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
                <div className="text-center mb-16">
                    <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                        <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                            Захистіть себе
                        </span>
                        <br />
                        <span className="text-white">від фішингу</span>
                    </h2>

                    <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Інтерактивна платформа для навчання розпізнавання
                        фішингових атак з використанням{" "}
                        <span className="text-cyan-400 font-semibold">
                            штучного інтелекту
                        </span>{" "}
                        та детальної аналітики
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link href={isLoggedIn ? "/simulation" : "/signup"}>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-blue-500/50 text-lg px-8 py-6"
                            >
                                <Rocket className="w-5 h-5 mr-2" />
                                Розпочати тренування
                            </Button>
                        </Link>
                        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-black hover:text-white text-lg px-8 py-6"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Переглянути демо
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {LANDING_STATS.map((stat, index) => (
                            <AnimatedStats
                                key={index}
                                value={stat.value}
                                label={stat.label}
                                icon={stat.icon}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <Target className="w-4 h-4 mr-2" />
                        Інтерактивна демонстрація
                    </Badge>
                    <h3 className="text-4xl sm:text-5xl font-bold mb-4">
                        Побачте <span className="text-cyan-400">загрози</span>{" "}
                        на власні очі
                    </h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Ось приклади фішингових листів, які наша AI-система
                        аналізує та пояснює
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {DEMO_PHISHING_EMAILS.map((email, index) => (
                        <PhishingDemoEmail
                            key={index}
                            email={email}
                            isActive={activeDemo === index}
                            onClick={() => setActiveDemo(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Унікальні можливості
                    </Badge>
                    <h3 className="text-4xl sm:text-5xl font-bold mb-4">
                        Чому <span className="text-cyan-400">PhishTrainer</span>
                        ?
                    </h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Сучасна платформа з передовими технологіями для
                        ефективного навчання
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LANDING_FEATURES.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            gradient={feature.gradient}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
                        <Zap className="w-4 h-4 mr-2" />
                        Простий процес
                    </Badge>
                    <h3 className="text-4xl sm:text-5xl font-bold mb-4">
                        Як це <span className="text-cyan-400">працює</span>?
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {WORKFLOW_STEPS.map((item, index) => (
                        <div key={index} className="relative">
                            <div className="text-center">
                                <div className="inline-block mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
                                        <div className="relative w-20 h-20 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                            <item.icon className="w-10 h-10 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-5xl font-black text-white/10 mb-4">
                                    {item.step}
                                </div>
                                <h4 className="text-2xl font-bold mb-3 text-white">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                            {index < WORKFLOW_STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-linear-to-r from-cyan-500/50 to-transparent -translate-x-1/2" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20">
                <Card className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-white/20 backdrop-blur-md p-12 text-center">
                    <h3 className="text-4xl sm:text-5xl font-bold mb-6">
                        Готові почати навчання?
                    </h3>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Приєднуйтесь до тисяч користувачів, які вже навчилися
                        захищатись від фішингу
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={isLoggedIn ? "/simulation" : "/signup"}>
                            <Button
                                size="lg"
                                className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-blue-500/50 text-lg px-12 py-6"
                            >
                                <Rocket className="w-5 h-5 mr-2" />
                                Розпочати безкоштовно
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Без кредитної картки
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Безкоштовний доступ
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Миттєвий старт
                        </div>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center p-2">
                                <Image
                                    src="/logo.svg"
                                    alt="PhishTrainer Logo"
                                    width={24}
                                    height={24}
                                    className="w-full h-full"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-white">
                                    PhishTrainer
                                </div>
                                <div className="text-xs text-gray-500">
                                    Next-Gen Security Training
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © 2025 PhishTrainer. Всі права захищені.
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
