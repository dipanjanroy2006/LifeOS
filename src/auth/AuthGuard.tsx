import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { LoadingSkeleton } from '../shared/components/common/LoadingSkeleton';

export const AuthGuard: React.FC = () => {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  // Redirect to Dashboard if already authenticated
  if (user && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
