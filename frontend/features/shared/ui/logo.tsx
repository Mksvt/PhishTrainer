import Image from "next/image";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
    const sizeClasses = {
        sm: { container: "w-8 h-8", icon: 20, text: "text-lg" },
        md: { container: "w-10 h-10", icon: 24, text: "text-xl" },
        lg: { container: "w-12 h-12", icon: 32, text: "text-2xl" },
    };

    const classes = sizeClasses[size];

    return (
        <div className="flex items-center gap-2">
            <div
                className={`${classes.container} bg-primary rounded-lg flex items-center justify-center shrink-0 p-1.5`}
            >
                <Image 
                    src="/logo.svg" 
                    alt="PhishTrainer Logo" 
                    width={classes.icon} 
                    height={classes.icon}
                    className="w-full h-full"
                />
            </div>
            {showText && (
                <span className={`${classes.text} font-bold text-foreground`}>
                    PhishTrainer
                </span>
            )}
        </div>
    );
};
