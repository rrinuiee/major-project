import React from 'react';
import { Shield } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-accent p-8">
      <div className="animate-pulse">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-green)] to-[var(--tech-blue)] shadow-2xl">
          <Shield size={64} className="text-background" strokeWidth={2.5} />
        </div>
      </div>
      <h1 className="mb-2 text-4xl tracking-tight">Smart Helmet</h1>
      <p className="text-primary text-lg tracking-wide">Ride Safe. Ride Smart.</p>
    </div>
  );
}
