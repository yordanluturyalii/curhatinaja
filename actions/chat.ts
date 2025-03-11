"use server"

import {GoogleGenerativeAI} from "@google/generative-ai";
import {db} from "@/db";
import {messages} from "@/db/schema";

type ChatResponse = {
    error?: {};
    data?: {
        message: string;
    };
};

export default async function createChat(formData: FormData): Promise<ChatResponse> {
    try {
        const message = formData.get("message") as string;
        const sessionId = formData.get("sessionId") as string;
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-pro-exp-02-05"});
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1000,
            responseMimeType: "text/plain",
        };

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        })

        const result = await chatSession.sendMessage(message);

        await db.transaction(async (tx) => {
            try {
                await tx.insert(messages).values({
                    session_id: Number(sessionId),
                    role: "user",
                    message,
                });

                await tx.insert(messages).values({
                    session_id: Number(sessionId),
                    role: "ai",
                    message: result.response.text()
                })
            } catch (e) {
                console.log("error: ", e);
                tx.rollback();
                throw e;
            }
        });

        return {
            data: {
                message: result.response.text(),
            }
        }
    } catch (e) {
        console.error(e);
        return {error: e}
    }
}