import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/ui/sonner";
import "./styles.css";

// Import route components
import { RootLayout } from "./layouts/RootLayout";
import { NotFound } from "./layouts/notFound";
import { Home } from "./features/home/index";
import { Login } from "./features/auth/login";
import { Signup } from "./features/auth/signup";
import { ForgotPassword } from "./features/auth/forgot-password";
import { ResetPassword } from "./features/auth/reset-password";
import { Verify } from "./features/auth/verify";
import { Dashboard } from "./features/dashboard/dashboard";
import { Profile } from "./features/profile/profile";
import { Settings } from "./features/settings/settings";
import { ApiTokens } from "./features/settings/api-tokens";
import { Analyze } from "./features/analyze/analyze";
import { Result } from "./features/result/result";
import { History } from "./features/history/history";
import { Awareness } from "./features/awareness/awareness";
import { Patterns } from "./features/patterns/patterns";
import { Report } from "./features/report/report";
import { Contact } from "./features/contact/contact";
import { Help } from "./features/help/help";
import { About } from "./features/about/about";
import { Privacy } from "./features/legal/privacy";
import { Terms } from "./features/legal/terms";
import { Admin } from "./features/admin/index";
import { AdminFlagged } from "./features/admin/flagged";
import { PendingReports } from "./features/admin/pending-reports";
import { AdminLayout } from "./features/admin/admin";
import { WebsiteMonitoring } from "./features/admin/website-monitoring";
import { AIModelMonitoring } from "./features/admin/ai-model-monitoring";
import { ServerMonitoring } from "./features/admin/server-monitoring";
import { ExtensionMonitoring } from "./features/admin/extension-monitoring";
import { RealTimeMonitoring } from "./features/admin/real-time-monitoring";
import { UserManagement } from "./features/admin/user-management";
import { SystemSettings } from "./features/admin/system-settings";
import { AlertsIncidents } from "./features/admin/alerts-incidents";
import { Notifications } from "./features/notifications/notifications";
import { NotificationDetail } from "./features/notifications/notification-detail";
import { Search } from "./features/search/search";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify" element={<Verify />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/api-tokens" element={<ApiTokens />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="notifications/:id" element={<NotificationDetail />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="result" element={<Result />} />
            <Route path="history" element={<History />} />
            <Route path="awareness" element={<Awareness />} />
            <Route path="patterns" element={<Patterns />} />
            <Route path="report" element={<Report />} />
            <Route path="contact" element={<Contact />} />
            <Route path="help" element={<Help />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="search" element={<Search />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="website-monitoring" element={<Navigate to="/admin/website-monitoring/traffic" replace />} />
              <Route path="website-monitoring/traffic" element={<WebsiteMonitoring />} />
              <Route path="website-monitoring/errors" element={<WebsiteMonitoring />} />
              <Route path="website-monitoring/performance" element={<WebsiteMonitoring />} />
              <Route path="ai-model-monitoring" element={<Navigate to="/admin/ai-model-monitoring/accuracy" replace />} />
              <Route path="ai-model-monitoring/accuracy" element={<AIModelMonitoring />} />
              <Route path="ai-model-monitoring/performance" element={<AIModelMonitoring />} />
              <Route path="ai-model-monitoring/resources" element={<AIModelMonitoring />} />
              <Route path="ai-model-monitoring/health" element={<AIModelMonitoring />} />
              <Route path="server-monitoring" element={<Navigate to="/admin/server-monitoring/resources" replace />} />
              <Route path="server-monitoring/resources" element={<ServerMonitoring />} />
              <Route path="server-monitoring/api" element={<ServerMonitoring />} />
              <Route path="server-monitoring/database" element={<ServerMonitoring />} />
              <Route path="server-monitoring/uptime" element={<ServerMonitoring />} />
              <Route path="extension-monitoring" element={<Navigate to="/admin/extension-monitoring/installation" replace />} />
              <Route path="extension-monitoring/installation" element={<ExtensionMonitoring />} />
              <Route path="extension-monitoring/usage" element={<ExtensionMonitoring />} />
              <Route path="extension-monitoring/retention" element={<ExtensionMonitoring />} />
              <Route path="extension-monitoring/errors" element={<ExtensionMonitoring />} />
              <Route path="extension-monitoring/performance" element={<ExtensionMonitoring />} />
              <Route path="real-time-monitoring" element={<Navigate to="/admin/real-time-monitoring/events" replace />} />
              <Route path="real-time-monitoring/events" element={<RealTimeMonitoring />} />
              <Route path="real-time-monitoring/alerts" element={<RealTimeMonitoring />} />
              <Route path="real-time-monitoring/websocket" element={<RealTimeMonitoring />} />
              <Route path="alerts-incidents" element={<Navigate to="/admin/alerts-incidents/history" replace />} />
              <Route path="alerts-incidents/history" element={<AlertsIncidents />} />
              <Route path="alerts-incidents/incidents" element={<AlertsIncidents />} />
              <Route path="alerts-incidents/configuration" element={<AlertsIncidents />} />
              <Route path="user-management" element={<Navigate to="/admin/user-management/users" replace />} />
              <Route path="user-management/users" element={<UserManagement />} />
              <Route path="user-management/roles" element={<UserManagement />} />
              <Route path="user-management/permissions" element={<UserManagement />} />
              <Route path="system-settings" element={<Navigate to="/admin/system-settings/general" replace />} />
              <Route path="system-settings/general" element={<SystemSettings />} />
              <Route path="system-settings/integrations" element={<SystemSettings />} />
              <Route path="system-settings/notifications" element={<SystemSettings />} />
              <Route path="system-settings/security" element={<SystemSettings />} />
              <Route path="pending-reports" element={<PendingReports />} />
              <Route path="flagged" element={<AdminFlagged />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
