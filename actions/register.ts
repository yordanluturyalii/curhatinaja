"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { RegisterSchema } from "@/lib/schema";
import { hash } from "bcrypt-ts";
import { eq, or } from "drizzle-orm";

type FormState = {
    error?: {
        name?: string[];
        email?: string[];
        username?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    success?: boolean;
};

export default async function register(state: FormState, formData: FormData): Promise<FormState> {
    const parsed = RegisterSchema.safeParse({
        name: formData.get("name"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { name, username, email, password } = parsed.data;

    const existingUser = await db
        .select()
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, email)))
        .limit(1);

    if (existingUser.length > 0) {
        const error: FormState["error"] = {};

        if (existingUser.some(user => user.email === email)) {
            error.email = ["Email already exists"];
        }
        if (existingUser.some(user => user.username === username)) {
            error.username = ["Username already taken"];
        }

        return { error };
    }

    const hashPassword = await hash(password, 10);

    await db.insert(users).values({ name, username, email, password: hashPassword });

    return { success: true };
}
