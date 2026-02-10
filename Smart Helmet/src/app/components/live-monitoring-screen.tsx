import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  Activity,
  Gauge,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { StatusCard } from "@/app/components/status-card";

interface LiveMonitoringScreenProps {
  navigateTo: (screen: string) => void;
}

export function LiveMonitoringScreen({
  navigateTo,
}: LiveMonitoringScreenProps) {
  const [eyeStatus, setEyeStatus] = useState<"Open" | "Drowsy" | "Closed">(
    "Open",
  );
  const [motionLevel, setMotionLevel] = useState(45);
  const [speed, setSpeed] = useState(62);
  const [helmetWorn, setHelmetWorn] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Eye status from drowsiness
      if (data.drowsiness === "ACTIVE") setEyeStatus("Open");
      else if (data.drowsiness === "DROWSY") setEyeStatus("Drowsy");
      else setEyeStatus("Closed");

      // Motion from impact
      setMotionLevel(data.impact ? 95 : 30);

      // Helmet worn from ignition
      setHelmetWorn(data.ignitionAllowed);

      // Fake speed from gps for demo
      if (data.gps) {
        setSpeed(Math.floor((data.gps.lat * 10) % 120));
      }
    };

    return () => ws.close();
  }, []);

  const getEyeStatusColor = () => {
    if (eyeStatus === "Open") return "success";
    if (eyeStatus === "Drowsy") return "warning";
    return "danger";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent to-background px-6 pb-6 pt-12">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigateTo("home")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl">Live Monitoring</h1>
            <p className="text-sm text-muted-foreground">
              Real-time rider status
            </p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--danger-red)]" />
          <span className="text-sm uppercase tracking-wider text-[var(--danger-red)]">
            Live
          </span>
        </div>
      </div>

      {/* Monitoring Cards */}
      <div className="space-y-4 px-6 pt-6">
        {/* Eye Status - Large Card */}
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <Eye size={28} className="text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Eye Status
                </div>
                <div className="mt-1 text-2xl">{eyeStatus}</div>
              </div>
            </div>
            <div
              className={`rounded-full px-4 py-2 text-sm ${
                eyeStatus === "Open"
                  ? "bg-[var(--success-green)]/20 text-[var(--success-green)]"
                  : eyeStatus === "Drowsy"
                    ? "bg-[var(--warning-orange)]/20 text-[var(--warning-orange)]"
                    : "bg-[var(--danger-red)]/20 text-[var(--danger-red)]"
              }`}
            >
              {eyeStatus === "Open"
                ? "Normal"
                : eyeStatus === "Drowsy"
                  ? "Warning"
                  : "Alert"}
            </div>
          </div>
          <div className="rounded-xl bg-accent/50 p-4">
            <div className="text-xs text-muted-foreground">
              {eyeStatus === "Open" && "Eyes are open and alert. Safe to ride."}
              {eyeStatus === "Drowsy" &&
                "Drowsiness detected. Consider taking a break."}
              {eyeStatus === "Closed" && "Eyes closed! Pull over immediately."}
            </div>
          </div>
        </div>

        {/* Motion/Impact */}
        <StatusCard
          icon={<Activity size={24} className="text-primary" />}
          label="Motion Activity"
          value={`${motionLevel}%`}
          status={motionLevel > 80 ? "warning" : "normal"}
        />

        {/* Speed */}
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <Gauge size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Speed
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl">{speed}</span>
                <span className="text-lg text-muted-foreground">km/h</span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--tech-blue)] transition-all duration-500"
              style={{ width: `${Math.min((speed / 120) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Helmet Worn Status */}
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <Shield size={28} className="text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Helmet Status
                </div>
                <div className="mt-1 text-xl">
                  {helmetWorn ? "Properly Worn" : "Not Worn"}
                </div>
              </div>
            </div>
            {helmetWorn ? (
              <CheckCircle size={32} className="text-[var(--success-green)]" />
            ) : (
              <XCircle size={32} className="text-[var(--danger-red)]" />
            )}
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl text-primary">12.5</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Avg Speed (km/h)
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl text-primary">28</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Ride Time (min)
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl text-primary">8.2</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Distance (km)
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl text-primary">0</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Impacts Detected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
