import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema, insertBotSchema, insertResponseSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function registerRoutes(app: Express) {

  // Auth middleware
  const authMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const existingUser = await storage.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, passwordHash: hashedPassword });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { id: user.id, email: user.email, name: name || user.email.split('@')[0] }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json({ id: user.id, email: user.email, name: user.email.split('@')[0] });
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

  // Bot routes (protegidos)
  app.get("/api/bots", authMiddleware, async (req: any, res) => {
    try {
      const bots = await storage.getBotsByUserId(req.user.userId);
      res.json(bots);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bots/:id", authMiddleware, async (req: any, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.id));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      if (bot.userId !== req.user.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/bots", authMiddleware, async (req: any, res) => {
    try {
      const validatedData = insertBotSchema.parse({ ...req.body, userId: req.user.userId });
      const bot = await storage.createBot(validatedData);
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/bots/:id", authMiddleware, async (req: any, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.id));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      if (bot.userId !== req.user.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const updated = await storage.updateBot(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/bots/:id", authMiddleware, async (req: any, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.id));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      if (bot.userId !== req.user.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      await storage.deleteBot(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Response routes
  app.get("/api/bots/:botId/responses", authMiddleware, async (req: any, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.botId));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      if (bot.userId !== req.user.userId) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      const responses = await storage.getResponsesByBotId(parseInt(req.params.botId));
      res.json(responses);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Endpoint público para visualizar formulário
  app.get("/api/forms/:botId", async (req, res) => {
    try {
      const bot = await storage.getBotById(parseInt(req.params.botId));
      if (!bot) {
        return res.status(404).json({ message: "Bot não encontrado" });
      }
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Endpoint público para enviar resposta
  app.post("/api/forms/:botId/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse({ 
        botId: parseInt(req.params.botId),
        data: req.body.data 
      });
      const response = await storage.createResponse(validatedData);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}