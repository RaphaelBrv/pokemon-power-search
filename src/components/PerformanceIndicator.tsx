import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Zap } from "lucide-react";

interface PerformanceIndicatorProps {
  isVisible?: boolean;
}

export default function PerformanceIndicator({
  isVisible = false,
}: PerformanceIndicatorProps) {
  const [connectionSpeed, setConnectionSpeed] = useState<
    "fast" | "medium" | "slow" | "offline"
  >("fast");
  const [lastPing, setLastPing] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    const checkConnection = async () => {
      try {
        const start = Date.now();

        // Test simple de connectivité
        const response = await fetch(
          "https://daauiaxvmlrvterpfkod.supabase.co/rest/v1/",
          {
            method: "HEAD",
            mode: "no-cors",
          }
        );

        const ping = Date.now() - start;
        setLastPing(ping);

        if (ping < 200) {
          setConnectionSpeed("fast");
        } else if (ping < 500) {
          setConnectionSpeed("medium");
        } else {
          setConnectionSpeed("slow");
        }
      } catch (error) {
        setConnectionSpeed("offline");
        setLastPing(0);
      }
    };

    // Vérifier la connexion immédiatement puis toutes les 10 secondes
    checkConnection();
    const interval = setInterval(checkConnection, 10000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getSpeedConfig = () => {
    switch (connectionSpeed) {
      case "fast":
        return {
          icon: <Zap className="h-3 w-3" />,
          text: `Rapide (${lastPing}ms)`,
          variant: "default" as const,
          className: "bg-green-500 text-white",
        };
      case "medium":
        return {
          icon: <Wifi className="h-3 w-3" />,
          text: `Moyen (${lastPing}ms)`,
          variant: "secondary" as const,
          className: "bg-yellow-500 text-white",
        };
      case "slow":
        return {
          icon: <Wifi className="h-3 w-3" />,
          text: `Lent (${lastPing}ms)`,
          variant: "destructive" as const,
          className: "bg-orange-500 text-white",
        };
      case "offline":
        return {
          icon: <WifiOff className="h-3 w-3" />,
          text: "Hors ligne",
          variant: "destructive" as const,
          className: "bg-red-500 text-white",
        };
    }
  };

  const config = getSpeedConfig();

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} flex items-center gap-1 text-xs`}
    >
      {config.icon}
      {config.text}
    </Badge>
  );
}
