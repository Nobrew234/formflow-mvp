
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'choice';
  label: string;
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: string[];
}

export interface FormResponse {
  id: number;
  botId: number;
  data: Record<string, any>;
  submittedAt: string;
}

export interface DownloadableFile {
  id: string;
  name: string;
  url: string;
  size: number;
}

export interface FormCustomization {
  primaryColor?: string;
  backgroundColor?: string;
  chatEnabled?: boolean;
  logo?: string;
  downloadableFiles?: DownloadableFile[];
}

export interface Form {
  id: number;
  userId: number;
  name: string;
  status: 'draft' | 'published';
  flow: any;
  createdAt: string;
  updatedAt: string;
  // Computed fields for compatibility
  title?: string;
  fields?: FormField[];
  responses?: FormResponse[];
  customization?: FormCustomization;
}

const API_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('chatflow_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const useForms = (userId?: number) => {
  const queryClient = useQueryClient();

  const { data: forms = [], isLoading: loading } = useQuery({
    queryKey: ['bots', userId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bots`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Erro ao buscar formulários');
      
      return res.json() as Promise<Form[]>;
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_URL}/bots`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, status: 'draft', flow: {} }),
      });

      if (!res.ok) throw new Error('Erro ao criar formulário');
      
      return res.json() as Promise<Form>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots', userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Form> }) => {
      const res = await fetch(`${API_URL}/bots/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Erro ao atualizar formulário');
      
      return res.json() as Promise<Form>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots', userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/bots/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Erro ao deletar formulário');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots', userId] });
    },
  });

  const createForm = async (title: string) => {
    const form = await createMutation.mutateAsync(title);
    return { ...form, id: String(form.id) };
  };

  const updateForm = async (formId: string, updates: Partial<Form>) => {
    await updateMutation.mutateAsync({ id: Number(formId), updates });
  };

  const deleteForm = async (formId: string) => {
    await deleteMutation.mutateAsync(Number(formId));
  };

  const getForm = (formId: string) => {
    return forms.find(f => String(f.id) === formId);
  };

  const addResponse = async (formId: string, answers: Record<string, any>) => {
    const res = await fetch(`${API_URL}/forms/${formId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: answers }),
    });

    if (!res.ok) throw new Error('Erro ao enviar resposta');
    
    queryClient.invalidateQueries({ queryKey: ['responses', formId] });
  };

  return {
    forms: forms.map(f => ({ ...f, id: String(f.id), title: f.name })),
    loading,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    addResponse,
  };
};
