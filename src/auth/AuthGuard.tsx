import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { SplashLoader } from '../app/layouts/SplashLoader';

export const AuthGuard: React.FC = () => {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return <SplashLoader />;
  }

  // Redirect to Dashboard if already authenticated
  if (user && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
