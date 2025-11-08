"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface EmailDecisionProps {
    onAnswer: (isPhishing: boolean) => void;
    isDisabled?: boolean;
}

export const EmailDecision = ({
    onAnswer,
    isDisabled = false,
}: EmailDecisionProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Button
                onClick={() => onAnswer(true)}
                disabled={isDisabled}
                className="h-14 sm:h-16 text-base sm:text-lg bg-destructive hover:bg-destructive/90 gap-2"
            >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                Це фішинг!
            </Button>

            <Button
                onClick={() => onAnswer(false)}
                disabled={isDisabled}
                variant="outline"
                className="h-14 sm:h-16 text-base sm:text-lg gap-2 border-accent text-accent hover:bg-accent/10 hover:text-accent"
            >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Це легітимно
            </Button>
        </div>
    );
};
