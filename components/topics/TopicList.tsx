import Link from 'next/link';

export type Topic = { id: string; name: string; created_at: string };

export default function TopicList({ topics }: { topics: Topic[] }) {
    if (!topics.length)
        return (
            <p className="text-slate-400 text-sm">
                У вас пока нет созданных тем. Загрузите .txt файл слева.
            </p>
        );

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
                <div
                    key={t.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-md transition-colors hover:border-slate-700"
                >
                    <h3 className="font-medium text-slate-100 leading-snug">{t.name}</h3>
                    <Link
                        href={`/topics/${t.id}/study`}
                        className="rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-500 transition-all active:scale-[0.98] shadow-md shadow-blue-950/20"
                    >
                        Start Study
                    </Link>
                    <Link href={`/topics/${t.id}`} className="rounded-lg bg-blue-600 py-2 text-center text-sm text-white hover:bg-blue-500">
                        Просмотр
                    </Link>
                </div>
            ))}
        </div>
    );
}
