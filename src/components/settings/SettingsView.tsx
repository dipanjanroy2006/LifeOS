import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { Settings, Shield, Database, Bell, Moon, Download, Upload } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, habits, goals, habitLogs } = useLifeOSStore();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ habits, goals, habitLogs }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "lifeos_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Data Management</h2>
        <p className="text-xs text-zinc-400 mt-1">Configure profile preferences, themes, notifications, and export offline backups.</p>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">General Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Display Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => updateProfile({ full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Timezone</label>
            <input
              type="text"
              value={profile.timezone}
              onChange={(e) => updateProfile({ timezone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Backup & Data Portability</h3>
        </div>

        <p className="text-xs text-zinc-400">
          Your data is yours. Export full JSON snapshots of habits, goal trajectories, and journal records.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export JSON Data
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
