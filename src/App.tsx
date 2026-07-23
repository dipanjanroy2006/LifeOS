import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './shared/components/common/ErrorBoundary';
import { AppRouter } from './app/router';
import { SplashLoader } from './app/layouts/SplashLoader';
import './config/env'; // Triggers environment validation immediately on boot

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const Bootstrapper: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <SplashLoader />;
  }

  return <AppRouter />;
};

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <ToastProvider>
            <AuthProvider>
              <BrowserRouter>
                <Bootstrapper />
              </BrowserRouter>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
