// app/(app)/layout.tsx
import Link from 'next/link';
import { logout } from './actions';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3 backdrop-blur">
                <Link href="/dashboard" className="text-lg font-semibold text-white">
                    USMLE Helper
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href="/dictionary"
                        className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        Словарь
                    </Link>
                    <form action={logout}>
                        <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                            Выйти
                        </button>
                    </form>
                </div>
            </nav>
            {children}
        </div>
    );
}