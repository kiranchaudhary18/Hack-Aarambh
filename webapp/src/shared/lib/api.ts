const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";

    switch (response.status) {
      case 400:
        errorMessage = "Invalid request data";
        break;
      case 401:
        errorMessage = "Unauthorized. Please login again.";
        break;
      case 403:
        errorMessage = "Access denied. You don't have permission.";
        break;
      case 404:
        errorMessage = "Resource not found";
        break;
      case 409:
        errorMessage = "Resource already exists (e.g., email already registered)";
        break;
      case 500:
        errorMessage = "Server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `API error: ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name?: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  // Analysis
  analyzeText: (text: string) =>
    apiRequest("/analysis/text", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  analyzePdf: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/analysis/pdf`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => res.json());
  },

  // History
  getHistory: () => apiRequest("/history"),
  getAnalytics: () => apiRequest("/history/analytics"),

  // Admin
  getAdminStats: () => apiRequest("/admin/stats"),
  getFlaggedCases: () => apiRequest("/admin/flagged"),
  getAdminAnalytics: () => apiRequest("/admin/analytics"),

  // Password Reset
  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyCode: (email: string, code: string) =>
    apiRequest("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),
  resetPassword: (email: string, code: string, newPassword: string, confirmPassword: string) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword, confirmPassword }),
    }),

  // Email Verification
  verifyEmail: (token: string) =>
    apiRequest(`/auth/verify-email?token=${token}`, {
      method: "GET",
    }),
  resendVerificationEmail: (email: string) =>
    apiRequest("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  requestEmailUpdate: (newEmail: string) =>
    apiRequest("/auth/request-email-update", {
      method: "POST",
      body: JSON.stringify({ newEmail }),
    }),
  verifyEmailUpdate: (token: string) =>
    apiRequest(`/auth/verify-email-update?token=${token}`, {
      method: "GET",
    }),

  // Profile
  getProfile: () => apiRequest("/users/profile"),
  updateProfile: (data: { name?: string; email?: string; avatar?: string }) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => res.json());
  },

  // History by ID
  getHistoryById: (id: string) => apiRequest(`/history/${id}`),
  deleteHistory: (id: string) =>
    apiRequest(`/history/${id}`, {
      method: "DELETE",
    }),

  // API Tokens
  generateToken: (name?: string, expiresAt?: string) =>
    apiRequest("/tokens/generate", {
      method: "POST",
      body: JSON.stringify({ name, expiresAt }),
    }),
  getTokens: () => apiRequest("/tokens"),
  deleteToken: (tokenId: string) =>
    apiRequest(`/tokens/${tokenId}`, {
      method: "DELETE",
      body: JSON.stringify({ tokenId }),
    }),
};
