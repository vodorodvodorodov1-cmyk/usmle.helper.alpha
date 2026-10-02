import { getCardsForReview } from '@/app/(app)/topics/[topicId]/actions';
import StudyCard from '@/components/cards/Flashcard';

export default async function StudyPage({
    params,
}: {
    params: Promise<{ topicId: string }>;
}) {
    const { topicId } = await params;
    const cards = await getCardsForReview(topicId);

    return (
        <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-slate-950 p-4">
            <StudyCard cards={cards} />
        </main>
    );
}
