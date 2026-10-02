// app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        const { data, error } = await createClient().auth.signUp({
            email: fd.get('email') as string,
            password: fd.get('password') as string,
            options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        setLoading(false);
        if (error) return setError(error.message);
        if (data.session) {
            router.push('/dashboard');
            router.refresh();
        } else {
            setInfo('Проверьте почту для подтверждения.');
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <form
                onSubmit={onSubmit}
                className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
                <h1 className="mb-2 text-xl font-semibold text-white">Регистрация</h1>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    minLength={6}
                    required
                    className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                {info && <p className="text-sm text-green-400">{info}</p>}
                <button
                    disabled={loading}
                    className="rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
                >
                    {loading ? '...' : 'Sign up'}
                </button>
                <Link href="/login" className="text-center text-sm text-slate-400 hover:text-white">
                    Уже есть аккаунт? Log in
                </Link>
            </form>
        </main>
    );
}