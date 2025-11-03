import { useNavigate } from "react-router-dom";
import { Droplet, Brain, Smartphone, Cloud } from "lucide-react";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Info = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-primary">Como Funciona</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <Logo className="w-41 h-40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Sistema de Irrigação Inteligente
          </h2>
          <p className="text-muted-foreground">
            Tecnologia avançada para otimizar sua plantação
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Sensores Inteligentes</h3>
                <p className="text-muted-foreground text-sm">
                  Monitore em tempo real a umidade do solo, temperatura, luminosidade e nutrientes da sua plantação.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Análise de IA</h3>
                <p className="text-muted-foreground text-sm">
                  Algoritmos inteligentes analisam os dados e otimizam automaticamente a irrigação para economizar água e maximizar a produção.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Controle Mobile</h3>
                <p className="text-muted-foreground text-sm">
                  Acompanhe e controle sua plantação de qualquer lugar através do aplicativo mobile.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Dados na Nuvem</h3>
                <p className="text-muted-foreground text-sm">
                  Todos os dados são armazenados com segurança na nuvem e acessíveis a qualquer momento para análise histórica.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-primary/10 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-primary">Benefícios</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Economia de até 50% no consumo de água</li>
            <li>• Aumento de 30% na produtividade</li>
            <li>• Redução de desperdício de recursos</li>
            <li>• Monitoramento 24/7 automatizado</li>
            <li>• Alertas em tempo real</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Info;