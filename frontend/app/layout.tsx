import type { Metadata } from "next";
import { ReduxProvider } from "@/lib/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "PhishTrainer - Навчання розпізнавання фішингу",
    description:
        "Інтелектуальна SaaS-платформа для навчання розпізнавання фішингових атак з Explainable AI",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="uk">
            <body className="font-sans antialiased">
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
