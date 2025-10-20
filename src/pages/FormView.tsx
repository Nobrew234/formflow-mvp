import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockForms } from '@/hooks/useMockForms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

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

  const currentField = form?.fields[currentStep];
  const progress = form ? ((currentStep + 1) / form.fields.length) * 100 : 0;

  const handleNext = () => {
    if (!currentField) return;

    const error = validateField(currentField, answers[currentField.id]);
    if (error) {
      setErrors({ ...errors, [currentField.id]: error });
      toast.error(error);
      return;
    }

    setErrors({ ...errors, [currentField.id]: '' });

    if (currentStep < form.fields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
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
            <Button onClick={handleBackToHome}>Voltar ao Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <FormChat formTitle={form.title} chatEnabled={form.customization?.chatEnabled} />
      
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Pergunta {currentStep + 1} de {form.fields.length}
          </p>
        </div>

        {/* Question Card */}
        <Card className={`shadow-elegant transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <CardContent className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Question Label */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">
                  {currentStep + 1} → {form.fields.length}
                </span>
                <Label className="text-2xl md:text-3xl font-bold block">
                  {currentField?.label}
                  {currentField?.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                {currentField?.type === 'text' && (
                  <Input
                    placeholder={currentField.placeholder || "Digite sua resposta..."}
                    value={answers[currentField.id] || ''}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentField.id]: e.target.value });
                      setErrors({ ...errors, [currentField.id]: '' });
                    }}
                    onKeyPress={handleKeyPress}
                    maxLength={currentField.maxLength}
                    className="text-lg h-12"
                    autoFocus
                  />
                )}

                {currentField?.type === 'textarea' && (
                  <Textarea
                    placeholder={currentField.placeholder || "Digite sua resposta..."}
                    value={answers[currentField.id] || ''}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentField.id]: e.target.value });
                      setErrors({ ...errors, [currentField.id]: '' });
                    }}
                    maxLength={currentField.maxLength}
                    rows={6}
                    className="text-lg resize-none"
                    autoFocus
                  />
                )}

                {currentField?.type === 'email' && (
                  <Input
                    type="email"
                    placeholder={currentField.placeholder || "seu@email.com"}
                    value={answers[currentField.id] || ''}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentField.id]: e.target.value });
                      setErrors({ ...errors, [currentField.id]: '' });
                    }}
                    onKeyPress={handleKeyPress}
                    className="text-lg h-12"
                    autoFocus
                  />
                )}

                {currentField?.type === 'choice' && (
                  <RadioGroup
                    value={answers[currentField.id] || ''}
                    onValueChange={(value) => {
                      setAnswers({ ...answers, [currentField.id]: value });
                      setErrors({ ...errors, [currentField.id]: '' });
                    }}
                    className="space-y-3"
                  >
                    {currentField.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          setAnswers({ ...answers, [currentField.id]: option });
                          setErrors({ ...errors, [currentField.id]: '' });
                        }}
                      >
                        <RadioGroupItem value={option} id={`${currentField.id}-${idx}`} />
                        <Label 
                          htmlFor={`${currentField.id}-${idx}`} 
                          className="font-normal cursor-pointer text-base flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {errors[currentField?.id || ''] && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {errors[currentField?.id || '']}
                  </p>
                )}

                {currentField?.maxLength && (currentField.type === 'text' || currentField.type === 'textarea') && (
                  <p className="text-xs text-muted-foreground">
                    {(answers[currentField.id] || '').length} / {currentField.maxLength}
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-2"
                  size="lg"
                >
                  {currentStep === form.fields.length - 1 ? 'Enviar' : 'Próximo'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Pressione Enter ↵ para continuar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormView;
