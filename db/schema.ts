import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['user', 'ai']);
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative']);

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    username: varchar({length: 255}).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({length: 255}).notNull()
});

export const sessions = pgTable("sessions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().references(() => users.id, {onDelete: 'cascade'}).notNull(),
    created_at: timestamp().notNull().defaultNow()
});

export const messages = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    session_id: integer().references(() => sessions.id, {onDelete: "cascade"}).notNull(),
    role: roleEnum().notNull(),
    message: text().notNull(),
    created_at: timestamp().notNull().defaultNow()
});

export const results = pgTable('results', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    session_id: integer().references(() => sessions.id, {onDelete: 'cascade'}).notNull(),
    sentiment: sentimentEnum().notNull(),
    summary: text().notNull()
});


export const usersRelations = relations(users, ({one, many}) => ({
    sessions: many(sessions)
}));

export const sessionsRelations = relations(sessions, ({one, many}) => ({
    user: one(users, {
        fields: [sessions.user_id],
        references: [users.id]
    }),
    messages: many(messages),
    result: one(results, {
        fields: [sessions.id],
        references: [results.session_id]
    })
}));

export const messagesRelations = relations(messages, ({one}) => ({
    session: one(sessions, {
        fields: [messages.session_id],
        references: [sessions.id]
    }),
}));

export const resultsRelations = relations(results, ({one}) => ({
    session: one(sessions, {
        fields: [results.session_id],
        references: [sessions.id]
    })
}));