import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/ui/sonner";
import "./styles.css";

// Import route components
import { RootLayout } from "./layouts/RootLayout";
import { NotFound } from "./layouts/RootLayout";
import { Home } from "./features/home/index";
import { Login } from "./features/auth/login";
import { Signup } from "./features/auth/signup";
import { ForgotPassword } from "./features/auth/forgot-password";
import { ResetPassword } from "./features/auth/reset-password";
import { VerifyCode } from "./features/auth/verify-code";
import { Dashboard } from "./features/dashboard/dashboard";
import { Profile } from "./features/profile/profile";
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
            <Route path="verify-code" element={<VerifyCode />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
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
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
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
