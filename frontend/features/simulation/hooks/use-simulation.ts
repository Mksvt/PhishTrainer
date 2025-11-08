import { useState, useEffect } from "react";
import {
    useGetRandomEmailQuery,
    useCheckAnswerMutation,
    useGetEmailHistoryQuery,
    useClearEmailHistoryMutation,
} from "@/lib/api/apiSlice";
import type { ApiEmail, CheckAnswerResponse } from "@/lib/api/types";

export const useSimulation = () => {
    const [currentEmail, setCurrentEmail] = useState<ApiEmail | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
    const [feedbackData, setFeedbackData] =
        useState<CheckAnswerResponse | null>(null);
    const [emailCount, setEmailCount] = useState(0);

    const {
        data: emailData,
        isLoading: isLoadingEmail,
        refetch: fetchNewEmail,
    } = useGetRandomEmailQuery();
    const [checkAnswer, { isLoading: isCheckingAnswer }] =
        useCheckAnswerMutation();

    useEffect(() => {
        if (emailData?.email) {
            setCurrentEmail(emailData.email);
        }
    }, [emailData]);

    const handleAnswer = async (isPhishing: boolean) => {
        if (!currentEmail) return;

        setUserAnswer(isPhishing);

        const response = await checkAnswer({
            emailId: currentEmail.id,
            userAnswer: isPhishing,
        }).unwrap();

        setFeedbackData(response);
        setShowFeedback(true);
        setEmailCount((prev) => prev + 1);
    };

    const handleNext = () => {
        setShowFeedback(false);
        setUserAnswer(null);
        setFeedbackData(null);
        fetchNewEmail();
    };

    const resetSimulation = () => {
        setShowFeedback(false);
        setUserAnswer(null);
        setFeedbackData(null);
        setEmailCount(0);
    };

    return {
        currentEmail,
        showFeedback,
        userAnswer,
        feedbackData,
        emailCount,
        isLoadingEmail,
        isCheckingAnswer,
        handleAnswer,
        handleNext,
        fetchNewEmail,
        resetSimulation,
    };
};

export const useEmailHistory = () => {
    const [showHistory, setShowHistory] = useState(false);
    const {
        data: historyData,
        isLoading: isLoadingHistory,
        refetch: refetchHistory,
    } = useGetEmailHistoryQuery(undefined, {
        skip: !showHistory,
    });
    const [clearHistory, { isLoading: isClearingHistory }] =
        useClearEmailHistoryMutation();

    const handleViewHistory = () => {
        setShowHistory(true);
        refetchHistory();
    };

    const handleClearHistory = async () => {
        await clearHistory().unwrap();
        setShowHistory(false);
    };

    return {
        emailHistory: historyData?.emails || [],
        showHistory,
        isLoadingHistory,
        isClearingHistory,
        handleViewHistory,
        handleClearHistory,
        setShowHistory,
    };
};
