"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import type { CheckAnswerResponse } from "@/lib/api/types";

interface EmailFeedbackProps {
    feedback: CheckAnswerResponse;
    onNext: () => void;
}

export const EmailFeedback = ({ feedback, onNext }: EmailFeedbackProps) => {
    return (
        <Card
            className={`p-8 backdrop-blur-sm bg-card/50 border-border/50 mb-8 border-l-4 ${
                feedback.isCorrect
                    ? "border-l-accent bg-accent/5"
                    : "border-l-destructive bg-destructive/5"
            }`}
        >
            <div className="flex items-start gap-3 mb-4">
                {feedback.isCorrect ? (
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
                    {feedback.message}
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-bold text-foreground mb-2">
                    Пояснення (Explainable AI):
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                    {feedback.explanation}
                </p>
            </div>

            <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-secondary" />
                    Ознаки {feedback.correctAnswer ? "фішингу" : "легітимності"}
                    :
                </h4>
                <ul className="space-y-2">
                    {feedback.indicators.map((indicator, index) => (
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
                onClick={onNext}
                className="w-full bg-primary hover:bg-primary/90 h-11 gap-2"
            >
                Наступний лист
                <ArrowRight className="w-4 h-4" />
            </Button>
        </Card>
    );
};
