"use server"

import {db} from "@/db";
import {sessions, users} from "@/db/schema";
import {eq} from "drizzle-orm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

type SessionResponse = {
    error?: "",
    data?: {
        sessions: {
            id: number;
            role: string;
            personality: string;
        }
    }
}

export default async function createSession(formData: FormData): Promise<SessionResponse> {
    try {
        const session = await getServerSession(authOptions)
        const role = formData.get("role") as string;
        const personality = formData.get("personality") as string;

        if (!session) throw Error("Unauthorized");

        const user = await db.select().from(users).where(eq(users.email, session.user.email));
        if (!user) throw Error("Unauthorized");

        let id;
        await db.transaction(async (tx) => {
            try {
                const result = await tx.insert(sessions).values({
                    user_id: user[0].id,
                }).returning({id: sessions.id});
                id = result[0].id;
            } catch (txError) {
                console.error("Transaction error:", txError);
                throw txError;
            }
        });

        return {
            data: {
                sessions: {
                    id,
                    role: role,
                    personality: personality,
                }
            }
        };
    } catch (e) {
        console.log(e);
        return {error: e};
    }
}

type UpdateSessionResponse = {
    data: {
        id: number;
    }
}

export async function updateSession(formData: FormData): Promise<UpdateSessionResponse> {
    const sessionId = Number(formData.get("sessionId"))
    const timeRemaining = Number(formData.get("timeRemaining"))
    const ended = formData.get("ended") === "true"

    const result = await db.update(sessions)
        .set({
            time_remaining: timeRemaining,
            ended: ended,
        })
        .where(eq(sessions.id, sessionId))
        .returning({id: sessions.id});

    return {
        data: {
            id: result[0].id,
        }
    }
}