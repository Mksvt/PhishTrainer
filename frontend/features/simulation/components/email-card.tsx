import { Card } from "@/components/ui/card";
import type { ApiEmail } from "@/lib/api/types";
import { capitalize } from "@/lib/utils/formatters";

interface EmailCardProps {
    email: ApiEmail;
}

export const EmailCard = ({ email }: EmailCardProps) => {
    return (
        <Card className="p-4 sm:p-6 backdrop-blur-sm bg-card/50 border-border/50">
            <div className="border-b border-border pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="mb-2">
                    <label className="block text-xs text-muted-foreground font-medium">
                        ВІД:
                    </label>
                    <p className="font-mono text-xs sm:text-sm text-foreground break-all">
                        {email.from}
                    </p>
                </div>
                <div className="mb-2">
                    <label className="block text-xs text-muted-foreground font-medium">
                        ТЕМА:
                    </label>
                    <p className="font-semibold text-sm sm:text-base text-foreground">
                        {email.subject}
                    </p>
                </div>
                <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        {capitalize(email.category)}
                    </span>
                    <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded">
                        {capitalize(email.difficulty)}
                    </span>
                </div>
            </div>

            <div
                className="prose prose-sm max-w-none text-foreground mb-4 sm:mb-6 text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: email.body }}
            />
        </Card>
    );
};
