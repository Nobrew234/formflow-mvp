import { useState, useEffect } from 'react';

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
  id: string;
  formId: string;
  answers: Record<string, any>;
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
  id: string;
  userId: string;
  title: string;
  fields: FormField[];
  status: 'draft' | 'published';
  createdAt: string;
  responses: FormResponse[];
  customization?: FormCustomization;
}

export const useMockForms = (userId?: string) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadForms();
    }
  }, [userId]);

  const loadForms = () => {
    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    const userForms = allForms.filter((f: Form) => f.userId === userId);
    setForms(userForms);
    setLoading(false);
  };

  const createForm = (title: string) => {
    const newForm: Form = {
      id: crypto.randomUUID(),
      userId: userId!,
      title,
      fields: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      responses: [],
      customization: {
        chatEnabled: true,
      },
    };

    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    allForms.push(newForm);
    localStorage.setItem('chatflow_forms', JSON.stringify(allForms));
    setForms([...forms, newForm]);

    return newForm;
  };

  const updateForm = (formId: string, updates: Partial<Form>) => {
    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    const formIndex = allForms.findIndex((f: Form) => f.id === formId);

    if (formIndex !== -1) {
      allForms[formIndex] = { ...allForms[formIndex], ...updates };
      localStorage.setItem('chatflow_forms', JSON.stringify(allForms));
      setForms(forms.map(f => f.id === formId ? allForms[formIndex] : f));
    }
  };

  const deleteForm = (formId: string) => {
    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    const filtered = allForms.filter((f: Form) => f.id !== formId);
    localStorage.setItem('chatflow_forms', JSON.stringify(filtered));
    setForms(forms.filter(f => f.id !== formId));
  };

  const getForm = (formId: string) => {
    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    return allForms.find((f: Form) => f.id === formId);
  };

  const addResponse = (formId: string, answers: Record<string, any>) => {
    const allForms = JSON.parse(localStorage.getItem('chatflow_forms') || '[]');
    const formIndex = allForms.findIndex((f: Form) => f.id === formId);

    if (formIndex !== -1) {
      const response: FormResponse = {
        id: crypto.randomUUID(),
        formId,
        answers,
        submittedAt: new Date().toISOString(),
      };

      allForms[formIndex].responses.push(response);
      localStorage.setItem('chatflow_forms', JSON.stringify(allForms));
      
      if (userId === allForms[formIndex].userId) {
        loadForms();
      }
    }
  };

  return {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    addResponse,
  };
};
