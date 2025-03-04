import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) throw new Error("Please enter an email and password");
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);

        if (user.length === 0) throw new Error("Invalid Credentials");

        const validPassword = await compare("B4c0//", user[0].password);
        if (!validPassword) throw new Error("Invalid Credentials");

        return null;
      },
    })
  ],
  pages: {
    signIn: '/login'
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  }
});

export { handler as GET, handler as POST }