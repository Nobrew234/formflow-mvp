import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (mock localStorage)
    const storedUser = localStorage.getItem('chatflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login validation
    const users = JSON.parse(localStorage.getItem('chatflow_users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('chatflow_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Email ou senha inválidos' };
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup
    const users = JSON.parse(localStorage.getItem('chatflow_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'Email já cadastrado' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };

    users.push(newUser);
    localStorage.setItem('chatflow_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('chatflow_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatflow_user');
  };

  return { user, loading, login, signup, logout };
};
