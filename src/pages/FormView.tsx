import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockForms } from '@/hooks/useMockForms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FormChat } from '@/components/FormChat';

const FormView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { getForm, addResponse } = useMockForms();
  const form = getForm(formId!);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!form || form.status !== 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="text-center p-8">
          <CardTitle>Formulário não encontrado ou não publicado</CardTitle>
        </Card>
      </div>
    );
  }

  const validateField = (field: any, value: any) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email inválido';
      }
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `Máximo de ${field.maxLength} caracteres`;
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, answers[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    addResponse(formId!, answers);
    setSubmitted(true);
    toast.success('Respostas enviadas com sucesso!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="w-full max-w-md text-center shadow-elegant">
          <CardContent className="pt-12 pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Respostas Enviadas!</h2>
            <p className="text-muted-foreground mb-6">
              Obrigado por preencher o formulário.
            </p>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <FormChat formTitle={form.title} chatEnabled={form.customization?.chatEnabled} />
        <Card className="shadow-elegant">
          <CardHeader className="text-center space-y-4 border-b">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl">{form.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-base">
                    {index + 1}. {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {field.type === 'text' && (
                    <Input
                      placeholder={field.placeholder}
                      value={answers[field.id] || ''}
                      onChange={(e) => {
                        setAnswers({ ...answers, [field.id]: e.target.value });
                        setErrors({ ...errors, [field.id]: '' });
                      }}
                      maxLength={field.maxLength}
                      className={errors[field.id] ? 'border-destructive' : ''}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <Textarea
                      placeholder={field.placeholder}
                      value={answers[field.id] || ''}
                      onChange={(e) => {
                        setAnswers({ ...answers, [field.id]: e.target.value });
                        setErrors({ ...errors, [field.id]: '' });
                      }}
                      maxLength={field.maxLength}
                      rows={4}
                      className={errors[field.id] ? 'border-destructive' : ''}
                    />
                  )}

                  {field.type === 'email' && (
                    <Input
                      type="email"
                      placeholder={field.placeholder}
                      value={answers[field.id] || ''}
                      onChange={(e) => {
                        setAnswers({ ...answers, [field.id]: e.target.value });
                        setErrors({ ...errors, [field.id]: '' });
                      }}
                      className={errors[field.id] ? 'border-destructive' : ''}
                    />
                  )}

                  {field.type === 'choice' && (
                    <RadioGroup
                      value={answers[field.id] || ''}
                      onValueChange={(value) => {
                        setAnswers({ ...answers, [field.id]: value });
                        setErrors({ ...errors, [field.id]: '' });
                      }}
                    >
                      {field.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                          <Label htmlFor={`${field.id}-${idx}`} className="font-normal cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {errors[field.id] && (
                    <p className="text-sm text-destructive">{errors[field.id]}</p>
                  )}
                  {field.maxLength && (field.type === 'text' || field.type === 'textarea') && (
                    <p className="text-xs text-muted-foreground">
                      {(answers[field.id] || '').length} / {field.maxLength}
                    </p>
                  )}
                </div>
              ))}

              <Button type="submit" className="w-full" size="lg">
                Enviar Respostas
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormView;
