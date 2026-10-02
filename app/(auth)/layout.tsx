import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 text-slate-150">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">USMLE Helper</h2>
                    <p className="text-slate-400 text-xs mt-1">MVP Альфа-версия</p>
                </div>
                {children}
            </div>
        </div>
    );
}
