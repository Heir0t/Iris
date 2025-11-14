import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Droplet, Wind, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

interface Plantation {
  id: string;
  name: string;
  size_m2: number;
}

const Dashboard = () => {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        loadPlantations();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadPlantations = async () => {
    const { data, error } = await supabase
      .from("plantations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar plantações",
        description: error.message,
      });
    } else {
      setPlantations(data || []);
    }
    setLoading(false);
  };

  // Mock sensor data
  const getMockSensorData = () => ({
    moisture: Math.floor(Math.random() * 30) + 70,
    nitrogen: ["N", "P", "K"][Math.floor(Math.random() * 3)],
    light: Math.floor(Math.random() * 30) + 70,
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-primary">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : plantations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 mb-6 text-muted-foreground">
              <img className="opacity-30" src="assets/gota.png" alt="gota"/>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              Nenhuma plantação cadastrada
            </p>
            <p className="text-sm text-muted-foreground">
              Clique no "+" para adicionar
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {plantations.map((plantation) => {
              const data = getMockSensorData();
              return (
                <Card
                  key={plantation.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/field/${plantation.id}`)}
                >
                  <h3 className="font-semibold text-lg mb-3">{plantation.name}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Droplet className="w-8 h-8 text-primary" />
                      <span className="text-2xl font-bold text-primary">{data.moisture}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Wind className="w-8 h-8 text-primary" />
                      <span className="text-2xl font-bold text-primary">{data.nitrogen}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Sun className="w-8 h-8 text-primary" />
                      <span className="text-2xl font-bold text-primary">{data.light}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate("/add-field")}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-8 h-8" />
        </button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;