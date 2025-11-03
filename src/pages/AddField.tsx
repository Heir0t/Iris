import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";

const AddField = () => {
  const [name, setName] = useState("");
  const [cropFunction, setCropFunction] = useState("");
  const [size, setSize] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [systemId, setSystemId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado",
      });
      navigate("/");
      return;
    }

    const { error } = await supabase.from("plantations").insert({
      user_id: user.id,
      name,
      crop_function: cropFunction,
      size_m2: parseFloat(size),
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      system_id: systemId,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message,
      });
    } else {
      toast({
        title: "Plantação cadastrada!",
        description: "Sua plantação foi adicionada com sucesso.",
      });
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-primary">Cadastre sua Plantação</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Plantação</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Tamanho (m²)</Label>
            <Input
              id="size"
              type="number"
              step="0.01"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-4">
            <Label>Localização</Label>
            <div className="space-y-2">
              <Input
                placeholder="Longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="h-12"
              />
              <Input
                placeholder="Latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemId">ID do sistema</Label>
            <Input
              id="systemId"
              type="text"
              placeholder="ex:12345"
              value={systemId}
              onChange={(e) => setSystemId(e.target.value)}
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};

export default AddField;