import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Users, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          ChatFlow
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Crie formulários incríveis de forma rápida e intuitiva. 
          Sem complicação, apenas resultados.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="shadow-elegant">
            <Link to="/signup">
              Começar Grátis
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">
              Fazer Login
            </Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rápido e Intuitivo</h3>
            <p className="text-muted-foreground">
              Crie formulários profissionais em minutos com nossa interface drag-and-drop
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compartilhamento Fácil</h3>
            <p className="text-muted-foreground">
              Compartilhe seus formulários com um único link e colete respostas instantaneamente
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Validações Inteligentes</h3>
            <p className="text-muted-foreground">
              Garanta dados de qualidade com validações automáticas e campos obrigatórios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
