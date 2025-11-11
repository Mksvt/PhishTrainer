import { Card } from "@/components/ui/card";
import type { ApiEmail } from "@/lib/api/types";
import { capitalize } from "@/lib/utils/formatters";

interface EmailCardProps {
    email: ApiEmail;
}

export const EmailCard = ({ email }: EmailCardProps) => {
    return (
        <Card className="p-4 sm:p-6 backdrop-blur-md bg-white/5 border border-white/10 mb-6">
            <div className="border-b border-white/10 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="mb-2">
                    <label className="block text-xs text-gray-400 font-medium">
                        ВІД:
                    </label>
                    <p className="font-mono text-xs sm:text-sm text-gray-200 break-all">
                        {email.from}
                    </p>
                </div>
                <div className="mb-2">
                    <label className="block text-xs text-gray-400 font-medium">
                        ТЕМА:
                    </label>
                    <p className="font-semibold text-sm sm:text-base text-white">
                        {email.subject}
                    </p>
                </div>
                <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                        {capitalize(email.category)}
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                        {capitalize(email.difficulty)}
                    </span>
                </div>
            </div>

            <div
                className="prose prose-sm max-w-none text-black bg-white mb-4 sm:mb-6 text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: email.body }}
            />
        </Card>
    );
};
