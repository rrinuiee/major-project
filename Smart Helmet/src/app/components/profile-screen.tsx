import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Shield,
  Bluetooth,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wifi,
  Battery,
  Info,
} from "lucide-react";
import { useTheme } from "@/app/contexts/theme-context";

interface ProfileScreenProps {
  navigateTo: (screen: string) => void;
}

export function ProfileScreen({ navigateTo }: ProfileScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("emergencyContacts");
    return saved ? JSON.parse(saved) : { c1: "", c2: "", c3: "" };
  });
  const saveContacts = () => {
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    alert("Emergency contacts saved");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
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
            <h1 className="text-2xl">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-green)] to-[var(--tech-blue)]">
              <User size={40} className="text-background" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl">Alex Rider</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                alex.rider@email.com
              </p>
              <div className="mt-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                Premium Member
              </div>
            </div>
            <button className="rounded-lg border border-border bg-accent px-4 py-2 text-sm transition-colors hover:bg-secondary">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Helmet Device Info */}
      <div className="px-6 pb-4">
        <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Connected Device
        </h3>
        <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <Shield size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base">Smart Helmet Pro X</h3>
                <p className="text-sm text-muted-foreground">Model SH-2024</p>
              </div>
            </div>
            <div className="rounded-full bg-[var(--success-green)]/20 px-3 py-1 text-xs text-[var(--success-green)]">
              Connected
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Battery size={16} />
                <span className="text-xs">Battery</span>
              </div>
              <div className="mt-1 text-lg">78%</div>
            </div>
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wifi size={16} />
                <span className="text-xs">Signal</span>
              </div>
              <div className="mt-1 text-lg">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="px-6 pb-4">
        <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          App Preferences
        </h3>
        <div className="space-y-2">
          {/* Dark Mode */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Moon size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-sm">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  Night riding friendly
                </div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                theme === "dark" ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Bell size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-sm">Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Safety alerts & updates
                </div>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                notifications ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  notifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Bluetooth */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Bluetooth size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-sm">Bluetooth</div>
                <div className="text-xs text-muted-foreground">
                  Auto-connect helmet
                </div>
              </div>
            </div>
            <button
              onClick={() => setBluetooth(!bluetooth)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                bluetooth ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  bluetooth ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* More Options */}
      {/* Emergency Contacts */}
      <div className="px-6 pb-4">
        <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Emergency Contacts
        </h3>
        <div className="space-y-3 rounded-2xl border-2 border-border bg-card p-5 shadow-md">
          <input
            type="text"
            placeholder="Contact 1 phone number"
            value={contacts.c1}
            onChange={(e) => setContacts({ ...contacts, c1: e.target.value })}
            className="w-full rounded-lg border border-border bg-input p-3"
          />
          <input
            type="text"
            placeholder="Contact 2 phone number"
            value={contacts.c2}
            onChange={(e) => setContacts({ ...contacts, c2: e.target.value })}
            className="w-full rounded-lg border border-border bg-input p-3"
          />
          <input
            type="text"
            placeholder="Contact 3 phone number"
            value={contacts.c3}
            onChange={(e) => setContacts({ ...contacts, c3: e.target.value })}
            className="w-full rounded-lg border border-border bg-input p-3"
          />
          <button
            onClick={saveContacts}
            className="w-full rounded-xl bg-primary py-3 text-primary-foreground"
          >
            Save Contacts
          </button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          More
        </h3>
        <div className="space-y-2">
          <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Globe size={20} className="text-primary" />
              </div>
              <div className="text-sm">Language</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">English</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </button>

          <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <HelpCircle size={20} className="text-primary" />
              </div>
              <div className="text-sm">Help & Support</div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>

          <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Info size={20} className="text-primary" />
              </div>
              <div className="text-sm">About App</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">v2.1.0</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-destructive bg-destructive/10 p-4 text-destructive transition-all hover:bg-destructive/20 active:scale-95">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
