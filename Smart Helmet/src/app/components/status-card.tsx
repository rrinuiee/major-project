import React from 'react';

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status?: 'normal' | 'warning' | 'danger' | 'success';
  className?: string;
}

export function StatusCard({ icon, label, value, status = 'normal', className = '' }: StatusCardProps) {
  const statusColors = {
    normal: 'bg-card border-border',
    warning: 'bg-card border-[var(--warning-orange)]',
    danger: 'bg-card border-[var(--danger-red)]',
    success: 'bg-card border-[var(--success-green)]',
  };

  return (
    <div className={`rounded-2xl border-2 ${statusColors[status]} p-4 shadow-lg ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="text-xl mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}
