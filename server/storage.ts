
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, bots, responses, type User, type Bot, type Response, type NewUser, type NewBot, type NewResponse } from '@shared/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export const storage = {
  // User methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  },

  async createUser(data: NewUser): Promise<User> {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  // Bot methods
  async getBotsByUserId(userId: number): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.userId, userId));
  },

  async getBotById(id: number): Promise<Bot | undefined> {
    const result = await db.select().from(bots).where(eq(bots.id, id)).limit(1);
    return result[0];
  },

  async createBot(data: NewBot): Promise<Bot> {
    const result = await db.insert(bots).values(data).returning();
    return result[0];
  },

  async updateBot(id: number, data: Partial<NewBot>): Promise<Bot | undefined> {
    const result = await db
      .update(bots)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return result[0];
  },

  async deleteBot(id: number): Promise<void> {
    await db.delete(bots).where(eq(bots.id, id));
  },

  // Response methods
  async getResponsesByBotId(botId: number): Promise<Response[]> {
    return await db.select().from(responses).where(eq(responses.botId, botId));
  },

  async createResponse(data: NewResponse): Promise<Response> {
    const result = await db.insert(responses).values(data).returning();
    return result[0];
  },
};
