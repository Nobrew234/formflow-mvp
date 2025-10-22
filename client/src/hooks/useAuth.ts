
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = '/api';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('chatflow_token')
  );
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ['user', token],
    queryFn: async () => {
      if (!token) return null;
      
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        localStorage.removeItem('chatflow_token');
        setToken(null);
        return null;
      }
      
      return res.json() as Promise<User>;
    },
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      localStorage.setItem('chatflow_token', data.token);
      setToken(data.token);
      queryClient.setQueryData(['user', data.token], data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao criar conta');
      }

      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      localStorage.setItem('chatflow_token', data.token);
      setToken(data.token);
      queryClient.setQueryData(['user', data.token], data.user);
    },
  });

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      await signupMutation.mutateAsync({ email, password, name });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('chatflow_token');
    setToken(null);
    queryClient.setQueryData(['user', token], null);
    queryClient.clear();
  };

  return { user: user || null, loading, login, signup, logout };
};
