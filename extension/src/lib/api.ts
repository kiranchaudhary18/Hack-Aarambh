const API_BASE_URL = "http://localhost:3000";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Image Analysis
  analyzeImage: (image: string, apiToken: string) =>
    apiRequest("/analysis/image", {
      method: "POST",
      body: JSON.stringify({ image, apiToken }),
    }),
};
