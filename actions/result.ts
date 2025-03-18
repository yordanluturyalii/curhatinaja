'use server'

import {GoogleGenerativeAI} from "@google/generative-ai";
import {db} from "@/db";
import {messages, results, sessions} from "@/db/schema";
import {eq} from "drizzle-orm";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

type CreateResultResponse = {
    error?: {},
    data: {
        sentiment: string,
        mood: {
            happy: number,
            anxious: number,
            loving: number
        },
        summary: string,
        suggestions: string[],
        title: string
    }
}

export async function createResult(sessionId: number): Promise<CreateResultResponse> {
    try {
        const chat = await db.select({
            role: messages.role,
            message: messages.message
        }).from(messages)
            .where(eq(messages.session_id, sessionId))
            .orderBy(messages.created_at);

        if (chat.length === 0) throw new Error("No such session");

        const conversation = chat
            .map((msg) => `${msg.role}: ${msg.message}`)
            .join("\n");

        const prompt = `
            Berikut adalah percakapan antara user dan AI:

            ${conversation}

            Berdasarkan percakapan yang telah terjadi, buatlah ringkasan sesi chat ini dengan struktur sebagai berikut:

            1. **Sentimen:** Tentukan apakah percakapan ini memiliki sentimen utama *positive, negative,* atau *neutral* berdasarkan keseluruhan isi chat.

            2. **Mood & Persentase:** Identifikasi mood yang paling dominan dalam percakapan ini dan berikan persentase dalam bentuk angka. Mood hanya boleh berisi (happy, anxious, loving) Contoh:
               - Happy: 70%
               - Anxious: 20%
               - Loving: 10%
               (Persentase harus total 100%)

            3. **Summary:** Buat ringkasan singkat dari percakapan yang telah berlangsung. Jangan terlalu panjang, tetapi pastikan semua poin penting tersampaikan.

            4. **Suggestions:** Berikan saran konkret yang bisa dilakukan user berdasarkan percakapan ini. Saran harus actionable dan sesuai dengan peran AI yang dipilih user.

            5. **Title** Berikan judul dari yang dilakukan user berdasarkan percakapan ini. Jangan terlalu panjang, namun mampu menjelaskan tentang percakapan
            **Format Output (JSON):**
            Kembalikan hasil dalam format JSON agar dapat diolah dan ditampilkan di website. Contoh format:
            {
              "sentiment": "positive",
              "mood": {
                "happy": 70,
                "anxious": 20,
                "loving": 10
              },
              "summary": "User merasa senang setelah berbicara tentang pencapaian terbarunya, tetapi masih sedikit cemas tentang langkah berikutnya.",
              "suggestions": [
                "Teruskan kebiasaan positif yang sudah dilakukan.",
                "Buat rencana kecil untuk mengatasi kecemasan terkait langkah selanjutnya.",
                "Jangan ragu untuk berbicara lagi jika butuh dukungan."
              ],
              "title": "Kecemasan Berlebih Karena Tugas"
            }
        `;
        const model = genAI.getGenerativeModel({model: "gemini-2.0-pro-exp-02-05"});
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
        };

        const result = await model.generateContentStream({
            contents: [{role: "user", parts: [{text: prompt}]}],
            generationConfig,
        });
        const responseText = (await result.response).text();

        const parsedText = JSON.parse(responseText);

        await db.update(sessions).set({
            title: parsedText.title
        }).where(eq(sessions.id, sessionId));

        await db.insert(results).values({
            session_id: sessionId,
            sentiment: parsedText.sentiment,
            mood: parsedText.mood,
            summary: parsedText.summary,
            suggestions: parsedText.suggestions,
        })

        return {
            data: {
                sentiment: parsedText.sentiment,
                mood: {
                    happy: parsedText.mood.happy,
                    anxious: parsedText.mood.anxious,
                    loving: parsedText.mood.loving,
                },
                summary: parsedText.summary,
                suggestions: parsedText.suggestions,
                title: parsedText.title
            }
        }

    } catch (e) {
        console.log(e)
        return {
            error: e, data: {mood: {anxious: 0, happy: 0, loving: 0}, sentiment: "", suggestions: [], summary: "", title: ""}
        }
    }
}