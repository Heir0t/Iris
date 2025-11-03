# 🌿 IRIS – Sistema Inteligente de Irrigação

**IRIS** é um **web app desenvolvido em React com Vite**, que utiliza **Inteligência Artificial** para otimizar o uso da água na irrigação agrícola.  
O sistema cruza **dados do solo** (umidade, temperatura, pH, tipo de solo, cultura plantada) com **previsões climáticas em tempo real**, determinando automaticamente **o melhor momento para irrigar**.

---

## 🚀 Tecnologias Utilizadas

### 🌐 Frontend
- **React + Vite** → Estrutura leve e rápida para SPA (Single Page Application)
- **TypeScript** → Tipagem estática para maior confiabilidade
- **Axios / Fetch API** → Comunicação com o backend e APIs externas
- **Tailwind CSS** → Estilização moderna e responsiva

### ☁️ Backend e Banco de Dados
- **Supabase** → Banco de dados PostgreSQL gerenciado com autenticação integrada, armazenamento e APIs REST automáticas

### 🧠 Inteligência Artificial
- Algoritmo de decisão baseado em:
  - **Regras lógicas adaptativas** (nível de umidade, temperatura, pH)
  - **Previsão do tempo** (chuva e temperatura futura)

---

## 💡 Funcionalidades Principais

✅ **Cadastro de áreas agrícolas** com informações detalhadas (nome, localização, etc.)  
✅ **Visualização de dados climáticos e do solo em tempo real**  
✅ **Decisão automática de irrigação pela IA** – o sistema indica o momento ideal para irrigar  
✅ **Notificação de irrigações**
✅ **Interface intuitiva e responsiva** acessível em desktop e mobile  

---

## 🌐 Hospedagem

Disponível em: **iris.com**

---

## 🔧 Como Rodar o Projeto Localmente

### 1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/iris.git  
cd iris

### 2️⃣ Instalar as dependências
npm install  
# ou  
yarn install

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Supabase e da API de clima:

VITE_SUPABASE_URL=https://seu-projeto.supabase.co  
VITE_SUPABASE_KEY=sua_chave_publica  
VITE_WEATHER_API_KEY=sua_chave_de_api_climatica

### 4️⃣ Rodar o servidor de desenvolvimento
npm run dev  
O app ficará disponível em: **http://localhost:8080**

---

## ☁️ Integração com o Supabase

O Supabase é utilizado como **backend completo**, incluindo:
- **Autenticação de usuários** (login/cadastro)
- **Banco de dados PostgreSQL** para armazenamento de dados agrícolas
- **Storage** para imagens e arquivos de configuração
- **Edge Functions** para cálculos automatizados e lógica de decisão

Exemplo de estrutura de tabelas:

| Tabela | Descrição |
|--------|------------|
| `fields` | Áreas agrícolas registradas |
| `soil_data` | Leituras de umidade, pH, temperatura |
| `weather_forecast` | Dados meteorológicos recentes |
| `irrigation_logs` | Histórico de irrigações e decisões da IA |
| `users` | Usuários autenticados via Supabase Auth |

---

## 🧠 Lógica de Decisão da IA (Simplificada)

A IA da IRIS considera múltiplos fatores antes de recomendar irrigação:

1. **Umidade do solo** abaixo de um limiar (ex: < 35%)  
2. **Previsão de chuva** nas próximas horas (evita irrigação desnecessária)  
3. **Temperatura ambiente** alta ou baixa influencia evaporação  
4. **Tipo de cultura e solo** determinam sensibilidade hídrica  

**Exemplo simplificado:**
if (soil.moisture < 35 && !weather.forecast.includes('rain')) {  
  return 'Irrigar agora';  
} else {  
  return 'Adiar irrigação';  
}

---

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

## 🌱 Desenvolvido por

👤 **Heitor Augusto do Amaral da Silva**  
📘 Estudante da ETEC Monteiro Lobato  
💡 Projeto com foco em sustentabilidade e tecnologia agrícola

---

> “A tecnologia só é inteligente quando respeita a natureza.” 🌎
