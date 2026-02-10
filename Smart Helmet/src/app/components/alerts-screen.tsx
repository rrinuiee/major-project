import React from 'react';
import { ArrowLeft, AlertTriangle, AlertCircle, Phone, Eye, Activity } from 'lucide-react';

interface Alert {
  id: string;
  type: 'drowsiness' | 'impact' | 'sos';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface AlertsScreenProps {
  navigateTo: (screen: string) => void;
}

export function AlertsScreen({ navigateTo }: AlertsScreenProps) {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'sos',
      title: 'SOS Triggered',
      description: 'Emergency SOS was activated. Contacts have been notified.',
      timestamp: '2 hours ago',
      severity: 'high',
    },
    {
      id: '2',
      type: 'impact',
      title: 'Sudden Impact Detected',
      description: 'A sudden impact was detected. Impact level: Moderate.',
      timestamp: '5 hours ago',
      severity: 'high',
    },
    {
      id: '3',
      type: 'drowsiness',
      title: 'Drowsiness Detected',
      description: 'Eye closure detected for extended period. Take a break.',
      timestamp: 'Yesterday',
      severity: 'medium',
    },
    {
      id: '4',
      type: 'impact',
      title: 'Minor Impact Detected',
      description: 'A minor impact was detected. Impact level: Low.',
      timestamp: 'Yesterday',
      severity: 'low',
    },
    {
      id: '5',
      type: 'drowsiness',
      title: 'Drowsiness Warning',
      description: 'Frequent blinking detected. Consider resting.',
      timestamp: '2 days ago',
      severity: 'low',
    },
  ];

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'drowsiness':
        return <Eye size={24} className="text-[var(--warning-orange)]" />;
      case 'impact':
        return <Activity size={24} className="text-[var(--danger-red)]" />;
      case 'sos':
        return <Phone size={24} className="text-[var(--danger-red)]" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-[var(--tech-blue)]/10 border-[var(--tech-blue)]/30';
      case 'medium':
        return 'bg-[var(--warning-orange)]/10 border-[var(--warning-orange)]/30';
      case 'high':
        return 'bg-[var(--danger-red)]/10 border-[var(--danger-red)]/30';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent to-background px-6 pb-6 pt-12">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl">Alerts</h1>
            <p className="text-sm text-muted-foreground">Recent safety notifications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="text-xl text-[var(--danger-red)]">2</div>
            <div className="mt-1 text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="text-xl text-[var(--warning-orange)]">1</div>
            <div className="mt-1 text-xs text-muted-foreground">Warning</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <div className="text-xl text-[var(--tech-blue)]">2</div>
            <div className="mt-1 text-xs text-muted-foreground">Info</div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-wide text-muted-foreground">
            All Alerts ({alerts.length})
          </h3>
          <button className="text-sm text-primary hover:underline">Clear All</button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border-2 p-4 transition-all hover:scale-[1.01] ${getSeverityColor(
                alert.severity
              )}`}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base">{alert.title}</h3>
                    <div
                      className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                        alert.severity === 'high'
                          ? 'bg-[var(--danger-red)]/20 text-[var(--danger-red)]'
                          : alert.severity === 'medium'
                          ? 'bg-[var(--warning-orange)]/20 text-[var(--warning-orange)]'
                          : 'bg-[var(--tech-blue)]/20 text-[var(--tech-blue)]'
                      }`}
                    >
                      {alert.severity}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle size={14} />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
