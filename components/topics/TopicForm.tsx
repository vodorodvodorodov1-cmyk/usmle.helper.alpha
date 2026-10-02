// components/topics/TopicForm.tsx (теперь только имя)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTopic } from '@/app/(app)/dashboard/actions';

export default function TopicForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = await createTopic(name.trim());
            setName('');
            router.push(`/topics/${id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Topic Name"
                required
                className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <button
                disabled={loading}
                className="rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
            >
                {loading ? '...' : 'Create Topic'}
            </button>
        </form>
    );
}