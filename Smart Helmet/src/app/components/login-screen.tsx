import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onGuestLogin: () => void;
}

export function LoginScreen({ onLogin, onGuestLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background p-6">
      {/* Header */}
      <div className="mt-12 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-green)] to-[var(--tech-blue)] shadow-xl">
          <Shield size={40} className="text-background" strokeWidth={2.5} />
        </div>
        <h1 className="mb-1 text-3xl tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-12 flex-1">
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Email or Phone</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Mail size={20} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full rounded-xl border border-border bg-input px-12 py-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock size={20} className="text-muted-foreground" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-input px-12 py-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button type="button" className="text-sm text-primary hover:underline">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-primary py-4 text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          Sign In
        </button>

        {/* Guest Login */}
        <button
          type="button"
          onClick={onGuestLogin}
          className="mt-4 w-full rounded-xl border border-border bg-transparent py-4 text-foreground transition-all hover:bg-accent active:scale-95"
        >
          Continue as Guest
        </button>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button type="button" className="text-primary hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
