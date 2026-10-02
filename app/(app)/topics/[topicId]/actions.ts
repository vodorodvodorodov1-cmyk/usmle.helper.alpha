// app/(app)/topics/[topicId]/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateSrs, type Rating } from '@/lib/srs';

export async function getCardsForReview(topicId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('topic_id', topicId)
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function rateCard(
    cardId: string,
    rating: Rating,
    currentInterval: number,
    currentEase: number
) {
    const supabase = await createClient();
    const { next_review_date, interval_days, ease_factor } = calculateSrs(
        currentInterval,
        currentEase,
        rating
    );

    const { error } = await supabase
        .from('cards')
        .update({
            next_review_date: next_review_date.toISOString(),
            interval_days,
            ease_factor,
        })
        .eq('id', cardId);

    if (error) throw new Error(error.message);
}