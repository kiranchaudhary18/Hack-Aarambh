interface ResultData {
  id: string;
  title: string;
  company: string;
  snippet: string;
  date: string;
  score: number;
  verdict: "scam" | "suspicious" | "safe";
  reasons: Array<{
    label: string;
    severity: "high" | "med" | "low";
    detail: string;
  }>;
}

class ResultStore {
  private storageKey = "scamsniff_result";

  set(data: ResultData): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  get(): ResultData | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const resultStore = new ResultStore();
