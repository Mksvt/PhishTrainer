interface ErrorMessageProps {
    message: string;
    title?: string;
}

export const ErrorMessage = ({
    message,
    title = "Помилка",
}: ErrorMessageProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold text-destructive mb-2">
                    {title}
                </h2>
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

export const InlineError = ({ message }: { message: string }) => {
    return (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs sm:text-sm">
            {message}
        </div>
    );
};
