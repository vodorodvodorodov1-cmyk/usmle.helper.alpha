// components/topics/UploadZone.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadZone({ topicId }: { topicId: string }) {
    const router = useRouter();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const upload = async (file: File) => {
        const fd = new FormData();
        fd.append('topicId', topicId);
        fd.append('file', file);
        setLoading(true);
        setStatus('');
        try {
            const res = await fetch('/api/topics/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Ошибка');
            setStatus(`Добавлено карточек: ${data.count}`);
            router.refresh();
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) upload(f);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-700 p-10 text-slate-400 hover:border-slate-500"
        >
            <span>{loading ? 'Загрузка...' : 'Перетащите файл или нажмите (.txt, .csv, .pdf, .apkg)'}</span>
            <input
                type="file"
                accept=".txt,.csv,.pdf,.apkg"
                hidden
                disabled={loading}
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f);
                    e.target.value = '';
                }}
            />
            {status && <span className="text-sm text-slate-200">{status}</span>}
        </label>
    );
}