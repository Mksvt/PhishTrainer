interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    message?: string;
}

export const LoadingSpinner = ({
    size = "md",
    message,
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return (
        <div className="flex items-center justify-center">
            <div className="text-center">
                <div
                    className={`${sizeClasses[size]} border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4`}
                />
                {message && <p className="text-muted-foreground">{message}</p>}
            </div>
        </div>
    );
};

export const FullPageLoader = ({
    message = "Завантаження...",
}: {
    message?: string;
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" message={message} />
        </div>
    );
};
