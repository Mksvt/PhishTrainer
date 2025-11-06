'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useGetRandomEmailQuery,
  useCheckAnswerMutation,
} from '@/lib/api/apiSlice';
import type { ApiEmail, CheckAnswerResponse } from '@/lib/api/types';

export default function SimulationPage() {
  const [currentEmail, setCurrentEmail] = useState<ApiEmail | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [feedbackData, setFeedbackData] = useState<CheckAnswerResponse | null>(
    null
  );
  const [emailCount, setEmailCount] = useState(0);
  const router = useRouter();

  // RTK Query hooks
  const {
    data: emailData,
    isLoading: isLoadingEmail,
    refetch: fetchNewEmail,
  } = useGetRandomEmailQuery();
  const [checkAnswer, { isLoading: isCheckingAnswer }] =
    useCheckAnswerMutation();

  useEffect(() => {
    // Перевірка авторизації
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (emailData?.email) {
      setCurrentEmail(emailData.email);
    }
  }, [emailData]);

  const handleAnswer = async (isPhishing: boolean) => {
    if (!currentEmail) return;

    setUserAnswer(isPhishing);

    try {
      const response = await checkAnswer({
        emailId: currentEmail.id,
        userAnswer: isPhishing,
      }).unwrap();

      setFeedbackData(response);
      setShowFeedback(true);
      setEmailCount((prev) => prev + 1);
    } catch (error) {
      console.error('Помилка перевірки відповіді:', error);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setUserAnswer(null);
    setFeedbackData(null);
    fetchNewEmail();
  };

  if (isLoadingEmail || !currentEmail) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Завантаження листа...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                Симуляція поштової скриньки
              </h1>
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium">
                Лист #{emailCount + 1}
              </span>
            </div>
            <p className="text-muted-foreground">
              Проаналізуйте лист: це фішинг чи легітимне повідомлення?
            </p>
          </div>

          {/* Email Display */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
            {/* Email Headers */}
            <div className="border-b border-border pb-4 mb-4">
              <div className="mb-2">
                <label className="block text-xs text-muted-foreground font-medium">
                  ВІД:
                </label>
                <p className="font-mono text-sm text-foreground break-all">
                  {currentEmail.from}
                </p>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground font-medium">
                  ТЕМА:
                </label>
                <p className="font-semibold text-foreground">
                  {currentEmail.subject}
                </p>
              </div>
            </div>

            {/* Email Body */}
            <div
              className="prose prose-sm max-w-none text-foreground mb-6"
              dangerouslySetInnerHTML={{ __html: currentEmail.body }}
            />
          </Card>

          {/* Decision Section */}
          {!showFeedback && userAnswer === null && (
            <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-8">
              <h2 className="text-xl font-bold mb-6 text-foreground">
                Який ваш вердикт?
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="h-16 text-lg bg-destructive hover:bg-destructive/90 gap-2"
                >
                  ⚠️ Це фішинг!
                </Button>

                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="h-16 text-lg gap-2 border-accent text-accent hover:bg-accent/10"
                >
                  ✓ Це легітимно
                </Button>
              </div>
            </Card>
          )}

          {/* Feedback Section */}
          {showFeedback && feedbackData && (
            <Card
              className={`p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-8 border-l-4 ${
                feedbackData.isCorrect
                  ? 'border-l-accent bg-accent/5'
                  : 'border-l-destructive bg-destructive/5'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {feedbackData.isCorrect ? (
                  <>
                    <span className="text-3xl">✓</span>
                    <h3 className="text-2xl font-bold text-accent">
                      Правильно!
                    </h3>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">⚠️</span>
                    <h3 className="text-2xl font-bold text-destructive">
                      Неправильно
                    </h3>
                  </>
                )}
              </div>

              <div className="mb-4">
                <p className="text-lg text-foreground font-medium">
                  {feedbackData.message}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-foreground mb-2">
                  Пояснення (Explainable AI):
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feedbackData.explanation}
                </p>
              </div>

              <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <h4 className="font-bold text-foreground mb-2">
                  Ознаки фішингу:
                </h4>
                <ul className="space-y-2">
                  {feedbackData.indicators.map((indicator, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="text-secondary">•</span>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleNext}
                disabled={isCheckingAnswer}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2"
              >
                Наступний лист →
              </Button>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
            <h3 className="font-bold text-foreground mb-3">Підказки:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Завжди перевіряйте адресу відправника і домен посилань</li>
              <li>• Спеціальна паніка та мовні помилки - сигнали фішингу</li>
              <li>
                • Офіційні компанії ніколи не просять паролі або конфіденційні
                дані емейлом
              </li>
              <li>• Посилання на аресь офіційних посилань завжди шахрайство</li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
