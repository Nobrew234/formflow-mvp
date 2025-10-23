import type { User, Form, Response, InsertUser, InsertForm, InsertResponse } from "@shared/schema";

export interface IStorage {
  getUser(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  
  getForms(userId: number): Promise<Form[]>;
  getForm(id: number): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  
  getResponses(formId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private forms: Map<number, Form> = new Map();
  private responses: Map<number, Response> = new Map();
  private userIdCounter = 1;
  private formIdCounter = 1;
  private responseIdCounter = 1;

  async getUser(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { 
      id, 
      email: user.email,
      password: user.password,
      name: user.name || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getForms(userId: number): Promise<Form[]> {
    return Array.from(this.forms.values()).filter(f => f.userId === userId);
  }

  async getForm(id: number): Promise<Form | undefined> {
    return this.forms.get(id);
  }

  async createForm(form: InsertForm): Promise<Form> {
    const id = this.formIdCounter++;
    const newForm: Form = { 
      id,
      userId: form.userId,
      title: form.title,
      description: form.description || null,
      fields: form.fields,
      createdAt: new Date() 
    };
    this.forms.set(id, newForm);
    return newForm;
  }

  async updateForm(id: number, form: Partial<InsertForm>): Promise<Form> {
    const existing = this.forms.get(id);
    if (!existing) throw new Error("Form not found");
    const updated = { ...existing, ...form };
    this.forms.set(id, updated);
    return updated;
  }

  async deleteForm(id: number): Promise<void> {
    this.forms.delete(id);
  }

  async getResponses(formId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(r => r.formId === formId);
  }

  async createResponse(response: InsertResponse): Promise<Response> {
    const id = this.responseIdCounter++;
    const newResponse: Response = { 
      id,
      formId: response.formId,
      data: response.data,
      submittedAt: new Date() 
    };
    this.responses.set(id, newResponse);
    return newResponse;
  }
}

export const storage = new MemStorage();
