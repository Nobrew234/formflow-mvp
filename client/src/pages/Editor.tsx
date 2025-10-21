import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useMockForms, FormField } from '@/hooks/useMockForms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Save, Eye, Trash2, GripVertical, Send, Palette, Upload, X, FileDown } from 'lucide-react';
import { toast } from 'sonner';

const Editor = () => {
  const { formId } = useParams();
  const { user } = useMockAuth();
  const { getForm, updateForm } = useMockForms(user?.id);
  const navigate = useNavigate();
  
  const [form, setForm] = useState(getForm(formId!));
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!form) {
      toast.error('Formulário não encontrado');
      navigate('/dashboard');
    }
  }, [form, navigate]);

  const handleTitleChange = (title: string) => {
    const updated = { ...form!, title };
    setForm(updated);
    updateForm(formId!, updated);
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `Novo campo ${type}`,
      required: false,
      placeholder: '',
    };

    if (type === 'choice') {
      newField.options = ['Opção 1', 'Opção 2'];
    }

    const updated = { ...form!, fields: [...form!.fields, newField] };
    setForm(updated);
    updateForm(formId!, updated);
    setSelectedFieldId(newField.id);
    toast.success('Campo adicionado');
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updated = {
      ...form!,
      fields: form!.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    };
    setForm(updated);
    updateForm(formId!, updated);
  };

  const deleteField = (fieldId: string) => {
    const updated = {
      ...form!,
      fields: form!.fields.filter(f => f.id !== fieldId)
    };
    setForm(updated);
    updateForm(formId!, updated);
    setSelectedFieldId(null);
    toast.success('Campo removido');
  };

  const handlePublish = () => {
    if (form!.fields.length === 0) {
      toast.error('Adicione pelo menos um campo ao formulário');
      return;
    }

    updateForm(formId!, { status: 'published' });
    toast.success('Formulário publicado!');
    navigate(`/form/${formId}`);
  };

  const selectedField = form?.fields.find(f => f.id === selectedFieldId);

  if (!form) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="max-w-md font-semibold"
            />
            <Badge variant={form.status === 'published' ? 'default' : 'secondary'}>
              {form.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handlePublish}>
              <Send className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-[240px,1fr,300px] gap-4">
          {/* Sidebar - Components */}
          <Card className="p-4 h-fit sticky top-20">
            <h3 className="font-semibold mb-4">Adicionar Campo</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addField('text')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Texto Curto
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addField('textarea')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Texto Longo
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addField('email')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addField('choice')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Múltipla Escolha
              </Button>
            </div>
          </Card>

          {/* Center - Form Canvas */}
          <div className="space-y-4">
            {form.fields.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Seu formulário está vazio. Adicione campos usando o painel à esquerda.
                </p>
              </Card>
            ) : (
              form.fields.map((field, index) => (
                <Card
                  key={field.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedFieldId === field.id ? 'ring-2 ring-primary shadow-glow' : ''
                  }`}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-5 h-5 text-muted-foreground mt-2" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                      {field.type === 'text' && (
                        <Input placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'textarea' && (
                        <Textarea placeholder={field.placeholder} disabled rows={3} />
                      )}
                      {field.type === 'email' && (
                        <Input type="email" placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'choice' && (
                        <div className="space-y-2">
                          {field.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="radio" disabled />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Right Panel - Field Config & Customization */}
          <Card className="p-4 h-fit sticky top-20">
            <Tabs defaultValue="field" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="field">Campo</TabsTrigger>
                <TabsTrigger value="custom">
                  <Palette className="w-4 h-4 mr-1" />
                  Design
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="field" className="mt-4">
                {selectedField ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Configurações</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(selectedField.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Label do Campo</Label>
                        <Input
                          value={selectedField.label}
                          onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={selectedField.placeholder || ''}
                          onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                          placeholder="Texto de exemplo..."
                        />
                      </div>

                      {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
                        <div>
                          <Label>Máximo de Caracteres</Label>
                          <Input
                            type="number"
                            value={selectedField.maxLength || ''}
                            onChange={(e) => updateField(selectedField.id, { maxLength: parseInt(e.target.value) || undefined })}
                            placeholder="Sem limite"
                          />
                        </div>
                      )}

                      {selectedField.type === 'choice' && (
                        <div>
                          <Label>Opções (uma por linha)</Label>
                          <Textarea
                            value={selectedField.options?.join('\n') || ''}
                            onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                            rows={5}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label>Campo Obrigatório</Label>
                        <Switch
                          checked={selectedField.required}
                          onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Selecione um campo para configurar
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="mt-4 space-y-4">
                <h3 className="font-semibold">Customização</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Chat de Ajuda</Label>
                      <p className="text-xs text-muted-foreground">
                        Assistente para usuários
                      </p>
                    </div>
                    <Switch
                      checked={form.customization?.chatEnabled !== false}
                      onCheckedChange={(checked) => {
                        updateForm(formId!, {
                          customization: {
                            ...form.customization,
                            chatEnabled: checked,
                          }
                        });
                        const updated = {
                          ...form,
                          customization: {
                            ...form.customization,
                            chatEnabled: checked,
                          }
                        };
                        setForm(updated);
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Materiais para Download</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Arquivos disponíveis após envio
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {form.customization?.downloadableFiles?.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const files = form.customization?.downloadableFiles?.filter(f => f.id !== file.id) || [];
                              updateForm(formId!, {
                                customization: {
                                  ...form.customization,
                                  downloadableFiles: files,
                                }
                              });
                              setForm({
                                ...form,
                                customization: {
                                  ...form.customization,
                                  downloadableFiles: files,
                                }
                              });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '*/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const newFile = {
                                id: crypto.randomUUID(),
                                name: file.name,
                                url: reader.result as string,
                                size: file.size,
                              };
                              const files = [...(form.customization?.downloadableFiles || []), newFile];
                              updateForm(formId!, {
                                customization: {
                                  ...form.customization,
                                  downloadableFiles: files,
                                }
                              });
                              setForm({
                                ...form,
                                customization: {
                                  ...form.customization,
                                  downloadableFiles: files,
                                }
                              });
                              toast.success('Arquivo adicionado');
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Adicionar Arquivo
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Editor;
