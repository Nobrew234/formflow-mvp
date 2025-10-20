import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FormChatProps {
  formTitle: string;
  chatEnabled?: boolean;
}

export const FormChat = ({ formTitle, chatEnabled = true }: FormChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Estou aqui para ajudar com o formulário "${formTitle}". Como posso ajudar?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatEnabled) return null;

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: crypto.randomUUID(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ajuda') || input.includes('help')) {
      return 'Estou aqui para ajudar! Você pode me perguntar sobre qualquer campo do formulário ou como preenchê-lo.';
    }
    if (input.includes('email')) {
      return 'Para o campo de email, digite um endereço válido no formato: seuemail@exemplo.com';
    }
    if (input.includes('obrigator')) {
      return 'Os campos marcados com * são obrigatórios e devem ser preenchidos para enviar o formulário.';
    }
    
    return 'Entendo sua dúvida. Preencha os campos solicitados e clique em "Enviar Respostas" quando terminar.';
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-elegant"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-elegant flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat de Ajuda</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
              }`}
            >
              <p className="text-sm">{message.text}</p>
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

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
