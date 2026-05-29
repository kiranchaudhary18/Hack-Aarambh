const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
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

  register: (email: string, password: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Analysis
  analyzeText: (text: string) =>
    apiRequest("/analysis/text", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  analyzePdf: (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_BASE_URL}/analysis/pdf`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then((res) => res.json());
  },

  // History
  getHistory: () => apiRequest("/history"),

  // Admin
  getAdminStats: () => apiRequest("/admin/stats"),
  getFlaggedCases: () => apiRequest("/admin/flagged"),

  // Profile
  getProfile: () => apiRequest("/users/profile"),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
