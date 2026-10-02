// app/(app)/dictionary/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addWordToDictionary(word: string, context: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
                {
                    role: 'system',
                    content:
                        'Ты медицинский переводчик. Переведи это английское слово или фразу на русский язык. Возвращай ТОЛЬКО чистый перевод.',
                },
                { role: 'user', content: word },
            ],
        }),
    });
    if (!res.ok) throw new Error('Translation failed');

    const data = await res.json();
    const translation = data.choices?.[0]?.message?.content?.trim() ?? '';

    const { error } = await supabase.from('user_words').insert({
        user_id: user.id,
        word,
        translation,
        context_sentence: context,
    });
    if (error) throw new Error(error.message);

    revalidatePath('/dictionary');
}

export async function getUserWords() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
        .from('user_words')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message);
    return data ?? [];
}