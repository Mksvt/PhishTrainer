"use client";

import { Card } from "@/components/ui/card";
import type { ApiEmail } from "@/lib/api/types";
import { capitalize } from "@/lib/utils/formatters";
import { LoadingSpinner } from "@/features/shared/ui";

interface EmailHistoryModalProps {
    emails: ApiEmail[];
    isLoading: boolean;
    onClose: () => void;
}

export const EmailHistoryModal = ({
    emails,
    isLoading,
    onClose,
}: EmailHistoryModalProps) => {
    return (
        <Card className="p-6 mb-6 backdrop-blur-md bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">
                    Історія показаних листів
                </h2>
                <button
                    onClick={onClose}
                    className="text-2xl text-gray-400 hover:text-red-400 transition-colors"
                >
                    ×
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-8">
                        <LoadingSpinner
                            size="sm"
                            message="Завантаження історії..."
                        />
                    </div>
                ) : emails.length > 0 ? (
                    <div className="space-y-2">
                        {emails.map((email, index) => (
                            <div
                                key={email.id}
                                className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
                            >
                                <p className="text-sm font-medium text-white">
                                    {index + 1}. {email.subject}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {email.from}
                                </p>
                                <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                                    {capitalize(email.category)} -{" "}
                                    {capitalize(email.difficulty)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">Історія пуста</p>
                )}
            </div>
        </Card>
    );
};
