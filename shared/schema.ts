
import { pgTable, serial, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de bots
export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  flow: jsonb("flow"),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de respostas
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

// Schemas Zod para validação
export const insertUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email inválido"),
  passwordHash: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const selectUserSchema = createSelectSchema(users);

export const insertBotSchema = z.object({
  userId: z.number(),
  name: z.string().min(1, "Nome do bot é obrigatório"),
  flow: z.any().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const selectBotSchema = createSelectSchema(bots);

export const insertResponseSchema = z.object({
  botId: z.number(),
  data: z.record(z.any()),
});

export const selectResponseSchema = createSelectSchema(responses);

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Bot = typeof bots.$inferSelect;
export type NewBot = typeof bots.$inferInsert;
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
