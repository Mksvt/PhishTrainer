import { Shield } from "lucide-react";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
    const sizeClasses = {
        sm: { container: "w-8 h-8", icon: "w-5 h-5", text: "text-lg" },
        md: { container: "w-10 h-10", icon: "w-6 h-6", text: "text-xl" },
        lg: { container: "w-12 h-12", icon: "w-7 h-7", text: "text-2xl" },
    };

    const classes = sizeClasses[size];

    return (
        <div className="flex items-center gap-2">
            <div
                className={`${classes.container} bg-primary rounded-lg flex items-center justify-center shrink-0`}
            >
                <Shield className={`${classes.icon} text-primary-foreground`} />
            </div>
            {showText && (
                <span className={`${classes.text} font-bold text-foreground`}>
                    PhishTrainer
                </span>
            )}
        </div>
    );
};
