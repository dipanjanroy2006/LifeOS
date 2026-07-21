import React, { useEffect } from 'react';
import { useLifeOSStore } from './store/useLifeOSStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/common/CommandPalette';
import { supabase } from './lib/supabase';

import { DashboardView } from './components/dashboard/DashboardView';
import { HabitsView } from './components/habits/HabitsView';
import { GoalsView } from './components/goals/GoalsView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { JournalView } from './components/journal/JournalView';
import { SettingsView } from './components/settings/SettingsView';
import { ProfileView } from './components/profile/ProfileView';

export function App() {
  const { activePage, updateProfile, profile } = useLifeOSStore();

  useEffect(() => {
    // Check initial Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateProfile({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || profile.avatar_url,
        });
      }
    });

    // Listen for Auth changes (OAuth redirects, logins, signouts)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        updateProfile({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || profile.avatar_url,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderCurrentView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'habits':
        return <HabitsView />;
      case 'goals':
        return <GoalsView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'journal':
        return <JournalView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette />
    </div>
  );
}

export default App;
