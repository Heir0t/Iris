// src/lib/soilDataGenerator.ts

interface SoilData {
  moisture: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  soilPh: number;
  electricalConductivity: number;
  organicMatter: number;
  temperature: number;
}

export const generateSoilData = (plantationId: string): SoilData => {
  const seed = hashCode(plantationId);
  
  const random = seededRandom(seed);
  
  const moisture = Math.round(40 + random() * 45);
  
  const nitrogenLevels = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];
  const nitrogen = nitrogenLevels[Math.floor(random() * nitrogenLevels.length)];
  
  const phosphorusLevels = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];
  const phosphorus = phosphorusLevels[Math.floor(random() * phosphorusLevels.length)];
  
  const potassiumLevels = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];
  const potassium = potassiumLevels[Math.floor(random() * potassiumLevels.length)];
  
  const soilPh = Number((5.5 + random() * 2).toFixed(1));
  
  const electricalConductivity = Number((0.2 + random() * 1.8).toFixed(2));
  
  const organicMatter = Number((2 + random() * 4).toFixed(1));
  
  const temperature = Math.round(18 + random() * 10);
  
  return {
    moisture,
    nitrogen,
    phosphorus,
    potassium,
    soilPh,
    electricalConductivity,
    organicMatter,
    temperature,
  };
};

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

export const getSoilRecommendations = (soilData: SoilData): string[] => {
  const recommendations: string[] = [];
  
  if (soilData.moisture < 50) {
    recommendations.push("⚠️ Umidade baixa - Considere irrigação");
  } else if (soilData.moisture > 80) {
    recommendations.push("⚠️ Umidade alta - Verifique drenagem");
  }
  
  if (soilData.soilPh < 6.0) {
    recommendations.push("📊 pH baixo - Considere calagem");
  } else if (soilData.soilPh > 7.2) {
    recommendations.push("📊 pH alto - Pode afetar absorção de nutrientes");
  }
  
  if (soilData.nitrogen === 'Baixo') {
    recommendations.push("🌱 Nitrogênio baixo - Recomenda-se adubação nitrogenada");
  }
  
  if (soilData.organicMatter < 3) {
    recommendations.push("🍂 Matéria orgânica baixa - Adicione composto orgânico");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("✅ Condições do solo adequadas");
  }
  
  return recommendations;
};