// app/(app)/dashboard/page.tsx
import Link from 'next/link';
import { getUserTopics } from './actions';
import TopicForm from '@/components/topics/TopicForm';
import TopicList from '@/components/topics/TopicList';

export default async function DashboardPage() {
    const topics = await getUserTopics();

    return (
        <main className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-[320px_1fr]">
            <section className="h-fit rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="mb-4 font-semibold text-white">Новая тема</h2>
                <TopicForm />
            </section>
            <section className="space-y-4">
                <Link
                    href="/study/all"
                    className="block rounded-xl bg-blue-600 py-5 text-center text-lg font-semibold text-white shadow-lg hover:bg-blue-500"
                >
                    Начать общее повторение (Вразнобой)
                </Link>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <h2 className="mb-4 font-semibold text-white">Мои темы</h2>
                    <TopicList topics={topics} />
                </div>
            </section>
        </main>
    );
}