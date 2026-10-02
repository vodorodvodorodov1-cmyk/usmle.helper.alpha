import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'USMLE Step 1 Helper',
    description: 'AI-powered spaced repetition system for medical students',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased bg-gray-50 text-gray-900">
                {children}
            </body>
        </html>
    );
}
