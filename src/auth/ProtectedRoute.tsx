import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { SplashLoader } from '../app/layouts/SplashLoader';

export const ProtectedRoute: React.FC = () => {
  const { user, session, isEmailVerified, isLoading } = useAuth();

  if (isLoading) {
    return <SplashLoader />;
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
