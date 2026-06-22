import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AdminAnalytics } from "./features/admin/analytics";
import { AdminFlagged } from "./features/admin/flagged";
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
              <Route path="website-monitoring" element={<WebsiteMonitoring />} />
              <Route path="ai-model-monitoring" element={<AIModelMonitoring />} />
              <Route path="server-monitoring" element={<ServerMonitoring />} />
              <Route path="extension-monitoring" element={<ExtensionMonitoring />} />
              <Route path="real-time-monitoring" element={<RealTimeMonitoring />} />
              <Route path="alerts-incidents" element={<AlertsIncidents />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="system-settings" element={<SystemSettings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
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
