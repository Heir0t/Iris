import { Bell, Droplet, AlertTriangle, CheckCircle, X } from "lucide-react";
import Logo from "@/components/Logo";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  time: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Campo 2 está sendo irrigado",
      message: "Irrigação automática iniciada às 14:30",
      time: "2 min atrás",
    },
    {
      id: "2",
      type: "success",
      title: "Irrigação concluída",
      message: "Campo 1 foi irrigado com sucesso",
      time: "1 hora atrás",
    },
    {
      id: "3",
      type: "info",
      title: "Nível de água baixo",
      message: "Reservatório principal em 30%",
      time: "3 horas atrás",
    },
  ]);

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Droplet className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <h1 className="text-xl font-semibold text-primary">Notificações</h1>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Limpar
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Nenhuma notificação
            </p>
            <p className="text-sm text-muted-foreground">
              Você está em dia com tudo!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;