'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CheckCircle,
  XCircle,
  Zap,
  Award,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useGetUserStatsQuery } from '@/lib/api/apiSlice';

export default function DashboardPage() {
  const router = useRouter();

  // RTK Query hook
  const { data: statsData, isLoading } = useGetUserStatsQuery();

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Завантаження...</p>
          </div>
        </div>
      </>
    );
  }

  if (!statsData) {
    return null;
  }

  const stats = statsData.stats;
  const userData =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};

  const chartData = [
    {
      name: 'Розпізнано',
      value: stats.correctIdentified || 0,
    },
    {
      name: 'Пропущено',
      value: stats.incorrectIdentified || 0,
    },
    {
      name: 'На них впали',
      value: stats.scamsClicked || 0,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Ласкаво просимо, {userData.name}!
            </h1>
            <p className="text-muted-foreground">
              Відслідковуйте свій прогрес у розпізнаванні фішингових атак
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Рейтинг</p>
                  <p className="text-3xl font-bold text-primary">
                    {stats.rating || 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-primary/30" />
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Всього листів
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalEmails || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-foreground/30" />
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Розпізнано
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {stats.correctIdentified || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent/30" />
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    На них впали
                  </p>
                  <p className="text-3xl font-bold text-destructive">
                    {stats.scamsClicked || 0}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-destructive/30" />
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Статистика
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)',
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    Почни тренування
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Пройти через реалістичні симуляції фішингу та вивчити, як
                    розпізнавати атаки.
                  </p>
                  <Link href="/simulation">
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                      Почати
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 hover:border-secondary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    Переглянути профіль
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Детальний аналіз вашого прогресу, рейтингу та історії
                    симуляцій.
                  </p>
                  <Link href="/profile">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      Переглянути
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Як це працює?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Отримайте реалістичні листи
                  </h4>
                  <p>
                    Платформа генерує автентичні фішингові листи та легітимні
                    повідомлення.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Прийміть рішення
                  </h4>
                  <p>
                    Проаналізуйте кожний лист та виберіть: це фішинг чи
                    легітимне повідомлення?
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    Отримайте детальні пояснення
                  </h4>
                  <p>
                    Explainable AI розповідає, чому це лист був/не був фішингом
                    та як його розпізнати.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
