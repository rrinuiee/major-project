import React, { useState } from 'react';
import { ArrowLeft, Phone, User, Plus, Edit2, Trash2, Shield } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyContactsScreenProps {
  navigateTo: (screen: string) => void;
}

export function EmergencyContactsScreen({ navigateTo }: EmergencyContactsScreenProps) {
  const [autoSOS, setAutoSOS] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'Spouse',
    },
    {
      id: '2',
      name: 'Michael Chen',
      phone: '+1 (555) 987-6543',
      relationship: 'Brother',
    },
    {
      id: '3',
      name: 'Emergency Services',
      phone: '911',
      relationship: 'Emergency',
    },
  ]);

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
            <h1 className="text-2xl">Emergency Contacts</h1>
            <p className="text-sm text-muted-foreground">Manage your safety contacts</p>
          </div>
        </div>

        {/* Auto-SOS Toggle */}
        <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Shield size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base">Auto-SOS on Impact</h3>
                <p className="text-sm text-muted-foreground">Alert contacts automatically</p>
              </div>
            </div>
            <button
              onClick={() => setAutoSOS(!autoSOS)}
              className={`relative h-8 w-14 rounded-full transition-colors ${
                autoSOS ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  autoSOS ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-wide text-muted-foreground">
            Contacts ({contacts.length})
          </h3>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95">
            <Plus size={16} />
            Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-2xl border-2 border-border bg-card p-4 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-green)] to-[var(--tech-blue)]">
                  <User size={24} className="text-background" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base">{contact.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{contact.phone}</p>
                  <div className="mt-1 inline-block rounded-full bg-accent px-3 py-1 text-xs text-muted-foreground">
                    {contact.relationship}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent transition-colors hover:bg-secondary">
                    <Phone size={18} className="text-primary" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent transition-colors hover:bg-secondary">
                    <Edit2 size={18} className="text-foreground" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent transition-colors hover:bg-destructive/10">
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-6 rounded-2xl border border-border bg-accent/30 p-4">
          <div className="flex gap-3">
            <Shield size={20} className="shrink-0 text-primary" />
            <div className="text-sm text-muted-foreground">
              <p>
                When Auto-SOS is enabled, your emergency contacts will be automatically notified in
                case of a severe impact or if you trigger the SOS button manually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
