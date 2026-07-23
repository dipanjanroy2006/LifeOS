import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { MobileNav } from '../../components/layout/MobileNav';
import { CommandPalette } from '../../components/common/CommandPalette';
import { LoadingSkeleton } from '../../shared/components/common/LoadingSkeleton';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<LoadingSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette />
    </div>
  );
};
