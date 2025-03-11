"use server"

import {GoogleGenerativeAI} from "@google/generative-ai";
import {db} from "@/db";
import {messages, sessions} from "@/db/schema";
import {eq} from "drizzle-orm";

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

type GetChatResponse = {
    error?: {};
    data?: {
        message: {
            role: string,
            message: string
        }[],
        session: {
            time_remaining: number,
            ended: boolean
        }
    }
}

export async function getChats(sessionId: number): Promise<GetChatResponse> {
    try {
        const message = await db.select({
            role: messages.role,
            message: messages.message
        }).from(messages)
            .where(eq(messages.session_id, sessionId))
            .orderBy(messages.created_at);

        const session = await db.select({
            time_remaining: sessions.time_remaining,
            ended: sessions.ended,
        })
            .from(sessions)
            .where(eq(sessions.id, sessionId))
            .limit(1)

        return {
            data: {
                message: message,
                session: {
                    time_remaining: session[0].time_remaining,
                    ended: session[0].ended,
                }
            }
        }
    } catch (e) {
        console.error(e);
        return {error: e};
    }
}