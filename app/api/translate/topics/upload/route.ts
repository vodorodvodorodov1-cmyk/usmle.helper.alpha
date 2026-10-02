// app/api/topics/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Row = { topic_id: string; front_text: string; back_text: string };

const parseLines = (text: string, sep: string, topic_id: string): Row[] =>
    text
        .split(/\r?\n/)
        .map((line) => {
            const i = line.indexOf(sep);
            if (i === -1) return null;
            const front_text = line.slice(0, i).trim();
            const back_text = line.slice(i + 1).trim();
            return front_text && back_text ? { topic_id, front_text, back_text } : null;
        })
        .filter((r): r is Row => r !== null);

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const fd = await req.formData();
    const topicId = fd.get('topicId');
    const file = fd.get('file');
    if (typeof topicId !== 'string' || !(file instanceof File))
        return NextResponse.json({ error: 'topicId и file обязательны' }, { status: 400 });

    // проверка владельца топика (RLS отфильтрует чужие)
    const { data: topic } = await supabase.from('topics').select('id').eq('id', topicId).single();
    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

    const ext = file.name.split('.').pop()?.toLowerCase();
    let rows: Row[] = [];

    switch (ext) {
        case 'txt':
            rows = parseLines(await file.text(), ':', topicId);
            break;

        case 'csv':
            // наивно: делит по первой запятой. Для кавычек/многострочных ячеек → papaparse
            rows = parseLines(await file.text(), ',', topicId);
            break;

        case 'pdf':
            // TODO: const buf = Buffer.from(await file.arrayBuffer());
            // pdf-parse → текст → разбор на Q/A (regex или LLM через OpenRouter) → rows
            return NextResponse.json({ error: 'PDF пока не поддерживается' }, { status: 501 });

        case 'apkg':
            // TODO: .apkg = zip → JSZip: достать collection.anki2 (SQLite) →
            // sql.js: SELECT flds FROM notes → split по '\x1f' → front/back (+ strip HTML) → rows
            return NextResponse.json({ error: 'APKG пока не поддерживается' }, { status: 501 });

        default:
            return NextResponse.json({ error: 'Неподдерживаемый формат' }, { status: 415 });
    }

    // app/api/topics/upload/route.ts (заменить блок после проверки rows.length)
    if (!rows.length) return NextResponse.json({ error: 'Нет валидных карточек' }, { status: 422 });

    const { data: existing, error: selError } = await supabase
        .from('cards')
        .select('front_text')
        .eq('topic_id', topicId);
    if (selError) return NextResponse.json({ error: selError.message }, { status: 500 });

    const seen = new Set((existing ?? []).map((c) => c.front_text));
    const cardsToInsert = rows.filter((r) => {
        if (seen.has(r.front_text)) return false;
        seen.add(r.front_text); // дубли внутри самого файла
        return true;
    });

    if (!cardsToInsert.length)
        return NextResponse.json({ count: 0, skipped: rows.length });

    for (let i = 0; i < cardsToInsert.length; i += 500) {
        const { error } = await supabase.from('cards').insert(cardsToInsert.slice(i, i + 500));
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: cardsToInsert.length, skipped: rows.length - cardsToInsert.length });
}