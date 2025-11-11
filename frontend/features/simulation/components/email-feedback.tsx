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
            className={`p-6 sm:p-8 backdrop-blur-md bg-white/5 border mb-6 sm:mb-8 border-l-4 ${
                feedback.isCorrect
                    ? "border-l-green-400 border-white/10 bg-green-500/5"
                    : "border-l-red-400 border-white/10 bg-red-500/5"
            }`}
        >
            <div className="flex items-start gap-3 mb-4">
                {feedback.isCorrect ? (
                    <>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <h3 className="text-2xl font-bold text-green-400">
                            Правильно!
                        </h3>
                    </>
                ) : (
                    <>
                        <XCircle className="w-8 h-8 text-red-400" />
                        <h3 className="text-2xl font-bold text-red-400">
                            Неправильно
                        </h3>
                    </>
                )}
            </div>

            <div className="mb-4">
                <p className="text-lg text-white font-medium">
                    {feedback.message}
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-bold text-white mb-2">
                    Пояснення (Explainable AI):
                </h4>
                <p className="text-gray-300 leading-relaxed">
                    {feedback.explanation}
                </p>
            </div>

            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-cyan-400" />
                    Ознаки {feedback.correctAnswer ? "фішингу" : "легітимності"}
                    :
                </h4>
                <ul className="space-y-2">
                    {feedback.indicators.map((indicator, index) => (
                        <li
                            key={index}
                            className="text-sm text-gray-300 flex gap-2"
                        >
                            <span className="text-cyan-400">•</span>
                            {indicator}
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                onClick={onNext}
                className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50 h-11 gap-2"
            >
                Наступний лист
                <ArrowRight className="w-4 h-4" />
            </Button>
        </Card>
    );
};
