'use client';

import { useState } from 'react';
import { rateCard } from '@/app/(app)/topics/[topicId]/actions';
import { addWordToDictionary } from '@/app/(app)/dictionary/actions';

export type Card = {
    id: string;
    front_text: string;
    back_text: string;
    interval_days: number;
    ease_factor: number;
    translated_front?: string | null;
    translated_back?: string | null;
};

type Rating = 'hard' | 'good' | 'easy';

type Props = {
    cards: Card[];
    onRate?: (cardId: string, rating: Rating) => void;
    onAddWord?: (word: string, context: string) => void;
};

const RATINGS: { key: Rating; label: string; cls: string }[] = [
    { key: 'hard', label: 'Hard (1d)', cls: 'bg-red-600 hover:bg-red-500' },
    { key: 'good', label: 'Good (double)', cls: 'bg-blue-600 hover:bg-blue-500' },
    { key: 'easy', label: 'Easy (3.5x)', cls: 'bg-emerald-600 hover:bg-emerald-500' },
];

export default function StudyCard({ cards, onRate, onAddWord }: Props) {
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [frontTranslation, setFrontTranslation] = useState('');
    const [backTranslation, setBackTranslation] = useState('');
    const [loadingFront, setLoadingFront] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);
    const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);

    const card = cards[index];

    if (!card)
        return <div className="p-8 text-center text-slate-400 font-medium">🎉 Все карточки пройдены</div>;

    const translate = async (
        text: string,
        current: string,
        setText: (v: string) => void,
        setLoading: (v: boolean) => void
    ) => {
        if (current) return;
        setLoading(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLang: 'Russian' }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setText(data.translation ?? data.translatedText ?? data.text ?? '');
        } catch {
            setText('Ошибка перевода');
        } finally {
            setLoading(false);
        }
    };

    const handleMouseUp = () => {
        const sel = window.getSelection();
        const text = sel?.toString().trim();
        if (!sel || !text || sel.rangeCount === 0) return setPopup(null);
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setPopup({ x: rect.left + rect.width / 2, y: rect.top - 8, text });
    };

    const rate = (r: Rating) => {
        rateCard(card.id, r, card.interval_days, card.ease_factor).catch(console.error);
        onRate?.(card.id, r);
        setIndex((i) => i + 1);
        setShowAnswer(false);
        setFrontTranslation('');
        setBackTranslation('');
        setLoadingFront(false);
        setLoadingBack(false);
        setPopup(null);
    };

    const addWord = async () => {
        if (!popup) return;
        const text = popup.text;
        window.getSelection()?.removeAllRanges();
        setPopup(null);
        try {
            // Отправляем слово и чистый текст вопроса в качестве контекста
            await addWordToDictionary(text, card.front_text);
            alert('Добавлено в словарь!');
        } catch (error) {
            console.error(error);
            alert('Ошибка добавления');
        }
    };

    return (
        <div className="mx-auto w-full max-w-xl p-4">
            <p className="mb-2 text-sm text-slate-400 font-medium">
                {index + 1} / {cards.length}
            </p>

            <div
                onMouseUp={handleMouseUp}
                onMouseDown={() => setPopup(null)}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-lg relative"
            >
                <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-medium leading-relaxed">{card.front_text}</p>
                    <button
                        onClick={() =>
                            translate(card.front_text, frontTranslation, setFrontTranslation, setLoadingFront)
                        }
                        disabled={loadingFront}
                        className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                        Translate
                    </button>
                </div>
                {(loadingFront || frontTranslation) && (
                    <div className="mt-3 rounded-xl bg-slate-950 border border-slate-850 p-3 text-sm text-slate-300 leading-relaxed animate-fadeIn">
                        {loadingFront ? 'Перевод загружается...' : frontTranslation}
                    </div>
                )}

                <div
                    className={`overflow-hidden transition-all duration-500 ${showAnswer ? 'mt-6 max-h-none border-t border-slate-800 pt-6 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-base leading-relaxed text-slate-200">{card.back_text}</p>
                        <button
                            onClick={() =>
                                translate(card.back_text, backTranslation, setBackTranslation, setLoadingBack)
                            }
                            disabled={loadingBack}
                            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            Translate
                        </button>
                    </div>
                    {(loadingBack || backTranslation) && (
                        <div className="mt-3 rounded-xl bg-slate-950 border border-slate-850 p-3 text-sm text-slate-300 leading-relaxed animate-fadeIn">
                            {loadingBack ? 'Перевод загружается...' : backTranslation}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-500 transition-all shadow-lg active:scale-[0.99]"
                    >
                        Show Answer
                    </button>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {RATINGS.map((r) => (
                            <button
                                key={r.key}
                                onClick={() => rate(r.key)}
                                className={`rounded-xl py-3.5 font-medium text-sm text-white shadow-md transition-all active:scale-[0.98] ${r.cls}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {popup && (
                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={addWord}
                    style={{ left: popup.x, top: popup.y }}
                    className="fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-xl hover:bg-blue-500 transition-all"
                >
                    Add to Dictionary
                </button>
            )}
        </div>
    );
}
