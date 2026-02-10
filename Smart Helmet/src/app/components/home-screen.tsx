import React, { useState, useEffect } from "react";
import {
  Shield,
  Battery,
  AlertCircle,
  Navigation,
  Clock,
  Bell,
  User,
  Wifi,
  WifiOff,
  Eye,
  Activity,
  Phone,
} from "lucide-react";
import { StatusCard } from "@/app/components/status-card";
import { QuickActionCard } from "@/app/components/quick-action-card";

interface HomeScreenProps {
  navigateTo: (screen: string) => void;
}

export function HomeScreen({ navigateTo }: HomeScreenProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [drowsinessStatus, setDrowsinessStatus] = useState<"Normal" | "Drowsy">(
    "Normal",
  );
  const [impactStatus, setImpactStatus] = useState("None");
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.impact && !sosTriggered) {
        const contacts = JSON.parse(
          localStorage.getItem("emergencyContacts") || "{}",
        );
        if (!data.impact) {
          setSosTriggered(false);
        }

        const numbers = Object.values(contacts).filter(Boolean).join(", ");

        alert(
          `🚨 SOS sent to: ${numbers}\nLocation: ${data.gps.lat}, ${data.gps.lng}`,
        );
        setSosTriggered(true);
      }

      setDrowsinessStatus(data.drowsiness === "ACTIVE" ? "Normal" : "Drowsy");

      setImpactStatus(data.impact ? "Accident Detected" : "None");
      setIsConnected(true);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent to-background px-6 pb-6 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Rider</p>
          </div>
          <button
            onClick={() => navigateTo("profile")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border"
          >
            <User size={20} className="text-foreground" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-green)] to-[var(--tech-blue)]">
                <Shield
                  size={28}
                  className="text-background"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h2 className="text-lg">Smart Helmet</h2>
                <div className="mt-1 flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <Wifi size={16} className="text-[var(--success-green)]" />
                      <span className="text-sm text-[var(--success-green)]">
                        Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={16} className="text-[var(--danger-red)]" />
                      <span className="text-sm text-[var(--danger-red)]">
                        Disconnected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="rounded-lg border border-border bg-accent px-4 py-2 text-sm transition-colors hover:bg-secondary"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigateTo("navigation")}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-[var(--tech-blue)] py-3 text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Start Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="mt-6 px-6">
        <h3 className="mb-4 text-sm uppercase tracking-wide text-muted-foreground">
          Live Status
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <StatusCard
            icon={<Eye size={24} className="text-primary" />}
            label="Drowsiness"
            value={drowsinessStatus}
            status={drowsinessStatus === "Drowsy" ? "warning" : "normal"}
          />
          <StatusCard
            icon={<Activity size={24} className="text-primary" />}
            label="Impact"
            value={impactStatus}
            status={impactStatus === "None" ? "normal" : "warning"}
          />
          <StatusCard
            icon={<Shield size={24} className="text-primary" />}
            label="Ignition Status"
            value={isConnected ? "Allowed" : "Blocked"}
            status={isConnected ? "normal" : "warning"}
          />
          <div className="mt-6">
            <button
              onClick={() => navigateTo("monitoring")}
              className="w-full rounded-xl border border-primary bg-primary/10 py-3 text-primary shadow-md transition-all hover:bg-primary/20 active:scale-95"
            >
              View Live Sensor Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <div className="mt-6 px-6">
        <button
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--danger-red)] to-red-600 p-1 shadow-2xl transition-all"
          style={{
            boxShadow: impactStatus !== "None" ? "0 0 40px red" : "none",
          }}
        >
          <div className="flex items-center justify-center gap-3 rounded-xl bg-[var(--danger-red)] py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Phone size={32} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-2xl text-white">Emergency SOS</div>
              <div className="text-sm text-white/80">
                Press for immediate help
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
