// app/(app)/dashboard/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// app/(app)/dashboard/actions.ts (заменить createTopicWithCards)
export async function createTopic(name: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
        .from('topics')
        .insert({ name, user_id: user.id })
        .select('id')
        .single();
    if (error) throw new Error(error.message);

    revalidatePath('/dashboard');
    return data.id as string;
}
export async function getUserTopics() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}
export async function getAllCardsForReview() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
        .from('cards')
        .select('*, topics!inner(user_id)')
        .eq('topics.user_id', user.id)
        .lte('next_review_date', new Date().toISOString());
    if (error) throw new Error(error.message);

    const cards = (data ?? []).map(({ topics, ...card }) => card);
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}