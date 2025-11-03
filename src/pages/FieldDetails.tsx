import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Droplet, Wind, Sun, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

interface Plantation {
  id: string;
  name: string;
  crop_function: string;
  size_m2: number;
}

const FieldDetails = () => {
  const { id } = useParams();
  const [plantation, setPlantation] = useState<Plantation | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock sensor data with realistic values
  const sensorData = {
    moisture: 82,
    nitrogen: "N",
    light: 75,
    temperature: 24,
    humidity: 65,
    soilPh: 6.8,
  };

  useEffect(() => {
    loadPlantation();
  }, [id]);

  const loadPlantation = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("plantations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error.message,
      });
      navigate("/dashboard");
    } else {
      setPlantation(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-primary">{plantation?.name}</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Dados Climáticos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Thermometer className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Temperatura</span>
              <span className="text-2xl font-bold text-primary">{sensorData.temperature}°C</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Droplet className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Umidade Ar</span>
              <span className="text-2xl font-bold text-primary">{sensorData.humidity}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Sun className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Luminosidade</span>
              <span className="text-2xl font-bold text-primary">{sensorData.light}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Wind className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Vento</span>
              <span className="text-2xl font-bold text-primary">12 km/h</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Dados do Solo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Droplet className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Umidade Solo</span>
              <span className="text-2xl font-bold text-primary">{sensorData.moisture}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Wind className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Nitrogênio</span>
              <span className="text-2xl font-bold text-primary">{sensorData.nitrogen}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">pH do Solo</span>
              <span className="text-2xl font-bold text-primary">{sensorData.soilPh}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Área</span>
              <span className="text-2xl font-bold text-primary">{plantation?.size_m2}m²</span>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default FieldDetails;