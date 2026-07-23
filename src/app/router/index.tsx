import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import { AuthGuard } from '../../auth/AuthGuard';

// Auth Features (Direct imports for immediate availability)
import { WelcomeScreen } from '../../features/auth/components/WelcomeScreen';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { SignUpForm } from '../../features/auth/components/SignUpForm';
import { ForgotPasswordForm } from '../../features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '../../features/auth/components/ResetPasswordForm';
import { VerifyEmailScreen } from '../../features/auth/components/VerifyEmailScreen';

// Lazy Loaded Application Views
const DashboardView = React.lazy(() =>
  import('../../components/dashboard/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const HabitsView = React.lazy(() =>
  import('../../components/habits/HabitsView').then((m) => ({ default: m.HabitsView }))
);
const GoalsView = React.lazy(() =>
  import('../../components/goals/GoalsView').then((m) => ({ default: m.GoalsView }))
);
const CalendarView = React.lazy(() =>
  import('../../components/calendar/CalendarView').then((m) => ({ default: m.CalendarView }))
);
const AnalyticsView = React.lazy(() =>
  import('../../components/analytics/AnalyticsView').then((m) => ({ default: m.AnalyticsView }))
);
const JournalView = React.lazy(() =>
  import('../../components/journal/JournalView').then((m) => ({ default: m.JournalView }))
);
const ProfileView = React.lazy(() =>
  import('../../components/profile/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const SettingsView = React.lazy(() =>
  import('../../components/settings/SettingsView').then((m) => ({ default: m.SettingsView }))
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public/Auth Routes with AuthGuard (redirects to /dashboard if logged in) */}
      <Route element={<AuthGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Route>
      </Route>

      {/* Verify Email screen - standalone path */}
      <Route path="/verify-email" element={<VerifyEmailScreen />} />

      {/* Protected Routes (Require session & email verification) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/habits" element={<HabitsView />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/goals" element={<GoalsView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/journal" element={<JournalView />} />
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
