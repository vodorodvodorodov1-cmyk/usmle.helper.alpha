// lib/srs.ts
export type Rating = 'hard' | 'good' | 'easy';

export function calculateSrs(intervalDays: number, easeFactor: number, rating: Rating) {
    let interval: number;
    let ease = easeFactor;

    if (rating === 'hard') {
        interval = 1;
        ease = Math.max(1.3, ease - 0.2);
    } else if (rating === 'good') {
        interval = intervalDays === 0 ? 1 : Math.round(intervalDays * 2);
    } else {
        interval = intervalDays === 0 ? 3 : Math.round(intervalDays * 3.5);
        ease += 0.15;
    }

    const next = new Date();
    next.setDate(next.getDate() + interval);

    return { next_review_date: next, interval_days: interval, ease_factor: ease };
}