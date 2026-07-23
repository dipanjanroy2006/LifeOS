import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { LoadingSkeleton } from '../shared/components/common/LoadingSkeleton';

export const ProtectedRoute: React.FC = () => {
  const { user, session, isEmailVerified, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // If email confirmation is enabled and email is not verified, force verification route
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};
