import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'text required' }, { status: 400 });
        }

        console.log("Отправляем запрос на OpenRouter с ключом:", process.env.OPENAI_API_KEY ? "КЛЮЧ ЕСТЬ" : "КЛЮЧА НЕТ");

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000', // Обязательно для OpenRouter
                'X-Title': 'USMLE Helper MVP',          // Обязательно для OpenRouter
            },
            body: JSON.stringify({
                model: 'openrouter/free',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты профессиональный медицинский переводчик USMLE. Переведи предоставленный английский текст на русский язык, строго сохраняя сложную медицинскую терминологию. Возвращай ТОЛЬКО чистый текст перевода без каких-либо вводных слов, кавычек или комментариев.',
                    },
                    { role: 'user', content: text },
                ],
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Ошибка OpenRouter API статус ${res.status}:`, errorText);
            return NextResponse.json({ error: `OpenRouter error: ${res.status}` }, { status: res.status });
        }

        const data = await res.json();
        const translation = data.choices?.[0]?.message?.content?.trim() ?? '';

        return NextResponse.json({ translation });
    } catch (error) {
        console.error("Критическая ошибка сервера:", error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
