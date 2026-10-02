// app/(app)/study/all/page.tsx
import { getAllCardsForReview } from '@/app/(app)/dashboard/actions';
import StudyCard from '@/components/cards/Flashcard';

export default async function StudyAllPage() {
    const cards = await getAllCardsForReview();

    return (
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center p-4">
            <StudyCard cards={cards} />
        </main>
    );
}