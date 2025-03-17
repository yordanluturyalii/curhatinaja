"use server"

import {GoogleGenerativeAI} from "@google/generative-ai";
import {db} from "@/db";
import {messages, sessions, users} from "@/db/schema";
import {eq} from "drizzle-orm";
import {Pinecone} from "@pinecone-database/pinecone";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

const pinecone = new Pinecone({
    apiKey: process.env.NEXT_PINECONE_API_KEY,
});
const index = pinecone.index("curhatinaja");
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const storeMemory = async (userId: number, text: string) => {
    const model = genAI.getGenerativeModel({model: "embedding-001"});
    const result = model.embedContent(text);
    const embedding = (await result).embedding.values;

    await index.upsert([
        {
            id: `${userId}-${Date.now()}`,
            values: embedding,
            metadata: {userId, text}
        }
    ]);

    console.log("Successfully Saved Memory To Pinecone");
}

const getMemory = async (userId: number, sessionId: number, text: string) => {
    const model = genAI.getGenerativeModel({model: "embedding-001"});
    const result = model.embedContent(text);
    const embedding = (await result).embedding.values;

    const queryResults = await index.query({
        vector: embedding,
        topK: 8,
        filter: {userId: {"$eq": userId}},
        includeMetadata: true
    })

    const relevantMemories = queryResults.matches.map((match) => match.metadata.text);
    console.log(`Memory Found: ${relevantMemories}`);
    return relevantMemories;
}

type ChatResponse = {
    error?: {};
    data?: {
        message: string;
    };
};

export default async function createChat(formData: FormData): Promise<ChatResponse> {
    try {
        const auth = await getServerSession(authOptions);
        const message = formData.get("message") as string;
        const sessionId = formData.get("sessionId") as string;
        const role = formData.get('role') as string;
        const personality = formData.get('personality') as string;
        const model = genAI.getGenerativeModel({model: "gemini-2.0-pro-exp-02-05"});
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1000,
            responseMimeType: "text/plain",
        };
        const user = await db.select().from(users).where(eq(users.email, auth.user.email)).limit(1);

        const pastMemories = await getMemory(user[0].id, Number(sessionId), message);
        const memoryText = pastMemories.length > 0 ? `Berikut percakapan sebelumnya:\n${pastMemories.join("\n")}\n` : "Tidak ada percakapan sebelumnya.";

        const history = memoryText
            ? [{role: "user", parts: [{text: memoryText}]}]
            : [];

        const prompt = {
            role: "system",
            parts: [
                {
                    text: `
                    Anda adalah AI curhat yang dapat berperan sebagai ${role} dengan kepribadian ${personality}.
                    Tugas Anda adalah mendengarkan, memahami emosi user, dan memberikan tanggapan yang sesuai.
            
                    Jawablah dengan empati dan tetap relevan dengan percakapan sebelumnya.
                    Gunakan nada yang sesuai dengan peran dan kepribadian yang dipilih user.
                    Jika user pernah membahas hal yang sama sebelumnya, jangan ulangi pertanyaan yang sama, tapi lanjutkan percakapan dengan memberikan perspektif baru.
                    `
                }
            ]
        }

        const chatSession = model.startChat({
            generationConfig,
            history: history,
            systemInstruction: prompt
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

        await storeMemory(user[0].id, message);
        await storeMemory(user[0].id, result.response.text());

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