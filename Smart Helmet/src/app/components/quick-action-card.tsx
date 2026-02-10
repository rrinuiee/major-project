import React from 'react';

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function QuickActionCard({ icon, label, onClick, className = '' }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-6 shadow-md transition-all hover:scale-105 hover:border-primary hover:shadow-lg active:scale-95 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}
