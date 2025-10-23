import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
});

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fields: jsonb("fields").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  formId: serial("form_id").notNull(),
  data: jsonb("data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const insertFormSchema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.any().default([]),
});

export const insertResponseSchema = z.object({
  formId: z.number(),
  data: z.any(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;

export type User = typeof users.$inferSelect;
export type Form = typeof forms.$inferSelect;
export type Response = typeof responses.$inferSelect;
