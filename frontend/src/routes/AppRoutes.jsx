import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// General Pages
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OtpPage from '../pages/auth/OtpPage';

// Candidate User Pages
import DashboardPage from '../pages/user/DashboardPage';
import AnalyzePage from '../pages/user/AnalyzePage';
import ResultPage from '../pages/user/ResultPage';
import HistoryPage from '../pages/user/HistoryPage';
import AwarenessPage from '../pages/user/AwarenessPage';
import ProfilePage from '../pages/user/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import FlaggedCasesPage from '../pages/admin/FlaggedCasesPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing / Marketing Pages */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Auth / Recovery Pages (Isolated Layout) */}
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot" element={<ForgotPasswordPage />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="" element={<Navigate to="login" replace />} />
      </Route>

      {/* Candidate User Dashboard Route (Standard Sidebar Layout) */}
      <Route path="/user" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="analyze" element={<AnalyzePage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="awareness" element={<AwarenessPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Admin Panel Route (Standard Sidebar Layout - Custom Links) */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="flagged" element={<FlaggedCasesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
