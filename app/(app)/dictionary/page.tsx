// app/(app)/dictionary/page.tsx
import { getUserWords } from './actions';

export default async function DictionaryPage() {
    const words = await getUserWords();

    return (
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-4 text-xl font-semibold text-white">Словарь</h1>
            {!words.length ? (
                <p className="text-slate-400">Ваш словарь пока пуст</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                    <table className="w-full text-left text-sm text-slate-100">
                        <thead className="border-b border-slate-800 text-slate-400">
                            <tr>
                                <th className="p-3 font-medium">Слово</th>
                                <th className="p-3 font-medium">Перевод</th>
                                <th className="p-3 font-medium">Контекст</th>
                            </tr>
                        </thead>
                        <tbody>
                            {words.map((w) => (
                                <tr key={w.id} className="border-b border-slate-800 last:border-0">
                                    <td className="p-3 font-medium">{w.word}</td>
                                    <td className="p-3">{w.translation}</td>
                                    <td className="p-3 text-slate-400">{w.context_sentence}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}