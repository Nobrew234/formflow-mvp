import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useForms } from '@/hooks/useForms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Responses = () => {
  const { formId } = useParams<{ formId: string }>();
  const { user } = useAuth();
  const { getForm } = useForms(user?.id);
  const [, setLocation] = useLocation();
  
  const form = getForm(formId!);

  useEffect(() => {
    if (!form) {
      setLocation('/dashboard');
    }
  }, [form, setLocation]);

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{form.title}</h1>
            <p className="text-sm text-muted-foreground">
              {form.responses.length} {form.responses.length === 1 ? 'resposta' : 'respostas'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {form.responses.length === 0 ? (
          <Card className="text-center py-12 shadow-elegant">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
              <CardTitle>Nenhuma resposta ainda</CardTitle>
              <p className="text-muted-foreground mt-2">
                Compartilhe o formulário para começar a receber respostas
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation(`/form/${formId}`)}>
                Visualizar Formulário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {form.responses.map((response, index) => (
              <Card key={response.id} className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Resposta #{form.responses.length - index}</CardTitle>
                    <Badge variant="outline">
                      {format(new Date(response.submittedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className="border-l-2 border-primary/20 pl-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {field.label}
                      </p>
                      <p className="text-base">
                        {response.answers[field.id] || <span className="text-muted-foreground italic">Não respondido</span>}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Responses;
