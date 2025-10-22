import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema, insertBotSchema, insertResponseSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function registerRoutes(app: Express) {

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, passwordHash } = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(passwordHash, 10);
      const user = await storage.createUser({ email, passwordHash: hashedPassword });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { id: user.id, email: user.email, name: user.email.split('@')[0] }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { id: user.id, email: user.email, name: user.email.split('@')[0] }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bot routes
  app.get("/api/bots", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }
      const bots = await storage.getBotsByUserId(parseInt(userId));
      res.json(bots);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bots/:id", async (req, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.id));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const validatedData = insertBotSchema.parse(req.body);
      const bot = await storage.createBot(validatedData);
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bots/:id", async (req, res) => {
    try {
      const bot = await storage.updateBot(parseInt(req.params.id), req.body);
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/bots/:id", async (req, res) => {
    try {
      await storage.deleteBot(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Response routes
  app.get("/api/responses/:botId", async (req, res) => {
    try {
      const responses = await storage.getResponsesByBotId(parseInt(req.params.botId));
      res.json(responses);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}