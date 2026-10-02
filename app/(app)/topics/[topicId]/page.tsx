// app/(app)/topics/[topicId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UploadZone from '@/components/topics/UploadZone';

export default async function TopicPage({
    params,
}: {
    params: Promise<{ topicId: string }>;
}) {
    const { topicId } = await params;
    const supabase = await createClient();
    const { data: topic } = await supabase
        .from('topics')
        .select('id, name')
        .eq('id', topicId)
        .single();
    if (!topic) notFound();

    return (
        <main className="mx-auto max-w-3xl space-y-6 p-6">
            <h1 className="text-2xl font-semibold text-white">{topic.name}</h1>

            <div className="grid grid-cols-2 gap-4">
                <Link
                    href={`/topics/${topic.id}/study`}
                    className="rounded-xl bg-blue-600 py-6 text-center text-lg font-medium text-white hover:bg-blue-500"
                >
                    Start Study
                </Link>
                <a
                    href="#upload"
                    className="rounded-xl border border-slate-700 bg-slate-900 py-6 text-center text-lg font-medium text-slate-100 hover:bg-slate-800"
                >
                    Upload Cards
                </a>
            </div>

            <section id="upload" className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <UploadZone topicId={topic.id} />
            </section>
        </main>
    );
}