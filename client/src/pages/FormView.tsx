import { useParams } from 'react-router-dom';
import { useMockForms } from '@/hooks/useMockForms';
import { Card, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FormChatExperience } from '@/components/FormChatExperience';
import { FormChat } from '@/components/FormChat';

const FormView = () => {
  const { formId } = useParams();
  const { getForm, addResponse } = useMockForms();
  const form = getForm(formId!);

  const handleComplete = (answers: Record<string, any>) => {
    addResponse(formId!, answers);
    toast.success('Respostas enviadas com sucesso!');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  if (!form || form.status !== 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="text-center p-8">
          <CardTitle>Formulário não encontrado ou não publicado</CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <FormChat formTitle={form.title} chatEnabled={form.customization?.chatEnabled} />
      
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <div className="text-center py-6 border-b bg-card/50 backdrop-blur-sm rounded-t-xl">
          <h1 className="text-2xl md:text-3xl font-bold">{form.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Responda as perguntas abaixo de forma conversacional
          </p>
        </div>
        
        <div className="flex-1 bg-card/50 backdrop-blur-sm rounded-b-xl overflow-hidden">
        <FormChatExperience
          fields={form.fields}
          formTitle={form.title}
          onComplete={handleComplete}
          downloadableFiles={form.customization?.downloadableFiles}
        />
        </div>
      </div>
    </div>
  );
};

export default FormView;
