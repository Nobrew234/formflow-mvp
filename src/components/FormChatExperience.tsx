import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Send } from 'lucide-react';
import { z } from 'zod';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  maxLength?: number;
}

interface FormChatExperienceProps {
  fields: Field[];
  formTitle: string;
  onComplete: (answers: Record<string, any>) => void;
}

const emailSchema = z.string().trim().email({ message: "Email inválido" });
const phoneSchema = z.string().trim().regex(/^[\d\s\(\)\-\+]+$/, { message: "Telefone inválido" }).min(10, { message: "Telefone deve ter pelo menos 10 dígitos" });

export const FormChatExperience = ({ fields, formTitle, onComplete }: FormChatExperienceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Adicionar campos obrigatórios de email e telefone
  const [allFields] = useState<Field[]>(() => {
    const hasEmail = fields.some(f => f.type === 'email');
    const hasPhone = fields.some(f => f.label.toLowerCase().includes('telefone') || f.label.toLowerCase().includes('phone'));
    
    const additionalFields: Field[] = [];
    
    if (!hasEmail) {
      additionalFields.push({
        id: 'required_email',
        type: 'email',
        label: 'Qual é o seu email?',
        placeholder: 'seu@email.com',
        required: true
      });
    }
    
    if (!hasPhone) {
      additionalFields.push({
        id: 'required_phone',
        type: 'text',
        label: 'Qual é o seu telefone?',
        placeholder: '(00) 00000-0000',
        required: true
      });
    }
    
    return [...additionalFields, ...fields];
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentFieldIndex === -1) {
      // Mensagem de boas-vindas
      addBotMessage(`Olá! Vou te ajudar a preencher o formulário "${formTitle}". Vamos começar? 👋`);
      setTimeout(() => {
        setCurrentFieldIndex(0);
      }, 1000);
    } else if (currentFieldIndex < allFields.length) {
      // Mostrar próxima pergunta
      setTimeout(() => {
        const field = allFields[currentFieldIndex];
        addBotMessage(field.label + (field.required ? ' *' : ''));
      }, 500);
    } else if (!isComplete) {
      // Formulário completo
      setTimeout(() => {
        addBotMessage('Perfeito! Recebemos todas as suas respostas. Enviando... ✨');
        setTimeout(() => {
          setIsComplete(true);
          onComplete(answers);
        }, 1500);
      }, 500);
    }
  }, [currentFieldIndex, allFields, formTitle, isComplete]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'bot',
      content,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const validateField = (field: Field, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    if (field.type === 'email' && value) {
      try {
        emailSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          return e.errors[0].message;
        }
      }
    }

    if ((field.id === 'required_phone' || field.label.toLowerCase().includes('telefone') || field.label.toLowerCase().includes('phone')) && value) {
      try {
        phoneSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          return e.errors[0].message;
        }
      }
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `Máximo de ${field.maxLength} caracteres`;
    }

    return '';
  };

  const handleSubmit = (value?: string) => {
    const currentField = allFields[currentFieldIndex];
    const submitValue = value !== undefined ? value : inputValue;

    const validationError = validateField(currentField, submitValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    addUserMessage(submitValue);
    setAnswers(prev => ({ ...prev, [currentField.id]: submitValue }));
    setInputValue('');
    setCurrentFieldIndex(prev => prev + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const currentField = allFields[currentFieldIndex];

  if (isComplete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Respostas Enviadas!</h2>
          <p className="text-muted-foreground">Obrigado por preencher o formulário.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-card border rounded-bl-sm'
              }`}
            >
              <p className="text-base whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentField && currentFieldIndex < allFields.length && (
        <div className="border-t bg-card p-4 space-y-3">
          {error && (
            <p className="text-sm text-destructive animate-fade-in">{error}</p>
          )}

          {currentField.type === 'choice' ? (
            <RadioGroup
              value={inputValue}
              onValueChange={(value) => handleSubmit(value)}
              className="space-y-2"
            >
              {currentField.options?.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleSubmit(option)}
                >
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label 
                    htmlFor={`option-${idx}`} 
                    className="font-normal cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : currentField.type === 'textarea' ? (
            <div className="flex gap-2">
              <Textarea
                ref={inputRef as any}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentField.placeholder || "Digite sua resposta..."}
                maxLength={currentField.maxLength}
                rows={3}
                className="flex-1 resize-none"
                autoFocus
              />
              <Button onClick={() => handleSubmit()} size="icon" className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type={currentField.type === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentField.placeholder || "Digite sua resposta..."}
                maxLength={currentField.maxLength}
                className="flex-1 h-12 text-base"
                autoFocus
              />
              <Button onClick={() => handleSubmit()} size="icon" className="h-12 w-12">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {currentField.maxLength && (currentField.type === 'text' || currentField.type === 'textarea') && (
            <p className="text-xs text-muted-foreground text-right">
              {inputValue.length} / {currentField.maxLength}
            </p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Pressione Enter ↵ para enviar
          </p>
        </div>
      )}
    </div>
  );
};
