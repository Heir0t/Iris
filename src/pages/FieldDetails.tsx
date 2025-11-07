import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Droplet, Wind, Sun, Thermometer, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateSoilData, getSoilRecommendations } from "@/lib/soilDataGenerator";
import { fetchWeatherData, getWeatherAlerts } from "@/lib/weatherApi";

interface Plantation {
  id: string;
  name: string;
  crop_function: string;
  size_m2: number;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  light: number;
  windSpeed: number;
  precipitation: number;
  pressure: number;
  uvIndex: number;
  condition: string;
  icon: string;
}

const FieldDetails = () => {
  const { id } = useParams();
  const [plantation, setPlantation] = useState<Plantation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Gera dados do solo baseados no ID da plantação
  const soilData = id ? generateSoilData(id) : null;
  const soilRecommendations = soilData ? getSoilRecommendations(soilData) : [];
  const weatherAlerts = weatherData ? getWeatherAlerts(weatherData) : [];

  useEffect(() => {
    loadPlantation();
  }, [id]);

  useEffect(() => {
    if (plantation?.latitude && plantation?.longitude) {
      loadWeatherData();
    }
  }, [plantation]);

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

  const loadWeatherData = async () => {
    if (!plantation?.latitude || !plantation?.longitude) return;

    try {
      setWeatherLoading(true);
      const data = await fetchWeatherData(
        plantation.latitude,
        plantation.longitude
      );
      setWeatherData(data);
    } catch (error) {
      console.error("Erro ao carregar dados climáticos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clima",
        description: "Não foi possível obter dados climáticos atualizados",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!soilData || !plantation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar dados</p>
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
          <h1 className="text-xl font-semibold text-primary">{plantation.name}</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Alertas Climáticos */}
        {weatherData && weatherAlerts.length > 0 && weatherAlerts[0] !== "✅ Sem alertas climáticos" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {weatherAlerts.map((alert, i) => (
                <div key={i}>{alert}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Recomendações do Solo */}
        {soilRecommendations.length > 0 && soilRecommendations[0] !== "✅ Condições do solo adequadas" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {soilRecommendations.map((rec, i) => (
                <div key={i}>{rec}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Dados Climáticos</h2>
            {weatherLoading && (
              <span className="text-xs text-muted-foreground">Atualizando...</span>
            )}
            {weatherData && !weatherLoading && (
              <span className="text-2xl">{weatherData.icon}</span>
            )}
          </div>
          
          {weatherLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Carregando dados climáticos...</p>
            </div>
          ) : weatherData ? (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                  <Thermometer className="w-8 h-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Temperatura</span>
                  <span className="text-2xl font-bold text-primary">{weatherData.temperature}°C</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                  <Droplet className="w-8 h-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Umidade Ar</span>
                  <span className="text-2xl font-bold text-primary">{weatherData.humidity}%</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                  <Sun className="w-8 h-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Luminosidade</span>
                  <span className="text-2xl font-bold text-primary">{weatherData.light}%</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                  <Wind className="w-8 h-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Vento</span>
                  <span className="text-2xl font-bold text-primary">{weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Erro ao carregar dados climáticos</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Dados do Solo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Droplet className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Umidade Solo</span>
              <span className="text-2xl font-bold text-primary">{soilData.moisture}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <Wind className="w-8 h-8 text-primary" />
              <span className="text-sm text-muted-foreground">Nitrogênio</span>
              <span className="text-2xl font-bold text-primary">{soilData.nitrogen}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">pH do Solo</span>
              <span className="text-2xl font-bold text-primary">{soilData.soilPh}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Temperatura Solo</span>
              <span className="text-2xl font-bold text-primary">{soilData.temperature}°C</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Nutrientes (NPK)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Nitrogênio</span>
              <span className="text-lg font-bold text-primary">{soilData.nitrogen}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Fósforo</span>
              <span className="text-lg font-bold text-primary">{soilData.phosphorus}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Potássio</span>
              <span className="text-lg font-bold text-primary">{soilData.potassium}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Informações Adicionais</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Área</span>
              <span className="text-2xl font-bold text-primary">{plantation.size_m2}m²</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Matéria Orgânica</span>
              <span className="text-2xl font-bold text-primary">{soilData.organicMatter}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Condutividade</span>
              <span className="text-lg font-bold text-primary">{soilData.electricalConductivity} dS/m</span>
            </div>
            {weatherData && (
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Índice UV</span>
                <span className="text-2xl font-bold text-primary">{weatherData.uvIndex}</span>
              </div>
            )}
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default FieldDetails;