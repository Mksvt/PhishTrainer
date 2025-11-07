'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  History,
  RotateCcw,
} from 'lucide-react';
import {
  useGetRandomEmailQuery,
  useCheckAnswerMutation,
  useGetUserAnswerHistoryQuery,
} from '@/lib/api/apiSlice';
import type { ApiEmail, CheckAnswerResponse } from '@/lib/api/types';

// Функція для капіталізації тексту
const capitalize = (text: string) => {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function SimulationPage() {
  const [currentEmail, setCurrentEmail] = useState<ApiEmail | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [feedbackData, setFeedbackData] = useState<CheckAnswerResponse | null>(
    null
  );
  const [emailCount, setEmailCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  // RTK Query hooks
  const {
    data: emailData,
    isLoading: isLoadingEmail,
    refetch: fetchNewEmail,
  } = useGetRandomEmailQuery();
  const [checkAnswer, { isLoading: isCheckingAnswer }] =
    useCheckAnswerMutation();
  const { data: historyData, refetch: refetchHistory } =
    useGetUserAnswerHistoryQuery({ limit: 50, offset: 0 });

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

  const handleViewHistory = () => {
    refetchHistory();
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    setShowHistory(false);
    setEmailCount(0);
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
      <main className="min-h-screen bg-linear-to-br from-background via-card to-background">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Симуляція поштової скриньки
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewHistory}
                  className="text-xs sm:text-sm gap-2"
                >
                  <History className="w-4 h-4" />
                  Історія
                </Button>
                {emailCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearHistory}
                    className="text-xs sm:text-sm gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Скинути
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground">
              Проаналізуйте лист: це фішинг чи легітимне повідомлення?
            </p>
          </div>

          {/* History Modal */}
          {showHistory && (
            <Card className="p-6 mb-6 backdrop-blur-sm bg-card/50 border-border/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Історія показаних листів</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {historyData?.answers && historyData.answers.length > 0 ? (
                  <div className="space-y-2">
                    {historyData.answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="p-3 border border-border rounded-lg hover:bg-secondary/10 transition"
                      >
                        <p className="text-sm font-medium">
                          {index + 1}. Email ID: {answer.emailId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ваша відповідь:{' '}
                          {answer.userAnswer ? 'Фішинг' : 'Легітимний'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Результат:{' '}
                          {answer.isCorrect ? '✅ Правильно' : '❌ Неправильно'}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-secondary/20 text-secondary rounded">
                          {new Date(answer.answeredAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Історія пуста</p>
                )}
              </div>
            </Card>
          )}

          {/* Email Display */}
          <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50 mb-6 sm:mb-8">
            {/* Email Headers */}
            <div className="border-b border-border pb-3 sm:pb-4 mb-3 sm:mb-4">
              <div className="mb-2">
                <label className="block text-xs text-muted-foreground font-medium">
                  ВІД:
                </label>
                <p className="font-mono text-xs sm:text-sm text-foreground break-all">
                  {currentEmail.from}
                </p>
              </div>
              <div className="mb-2">
                <label className="block text-xs text-muted-foreground font-medium">
                  ТЕМА:
                </label>
                <p className="font-semibold text-sm sm:text-base text-foreground">
                  {currentEmail.subject}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                  {capitalize(currentEmail.category)}
                </span>
                <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded">
                  {capitalize(currentEmail.difficulty)}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div
              className="prose prose-sm max-w-none text-foreground mb-4 sm:mb-6 text-xs sm:text-sm"
              dangerouslySetInnerHTML={{
                __html: currentEmail.body,
              }}
            />
          </Card>

          {/* Decision Section */}
          {!showFeedback && userAnswer === null && (
            <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">
                Який ваш вердикт?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="h-14 sm:h-16 text-base sm:text-lg bg-destructive hover:bg-destructive/90 gap-2"
                >
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Це фішинг!
                </Button>

                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="h-14 sm:h-16 text-base sm:text-lg gap-2 border-accent text-accent hover:bg-accent/10 hover:text-accent"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Це легітимно
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
                    <CheckCircle className="w-8 h-8 text-accent" />
                    <h3 className="text-2xl font-bold text-accent">
                      Правильно!
                    </h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-destructive" />
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
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  Ознаки{' '}
                  {feedbackData.correctAnswer ? 'фішингу' : 'легітимності'}:
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
                Наступний лист
                <ArrowRight className="w-4 h-4" />
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
              <li>
                • Посилання на невірні адреси офіційних посилань завжди
                шахрайство
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
