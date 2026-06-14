import { useState } from "react";
import { setItem, storageKeys } from "../lib/storage";

export default function TokenInput({ onNext }: { onNext: () => void }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token.trim()) {
      setError("Please enter your API token");
      setLoading(false);
      return;
    }

    // Store the token
    await setItem(storageKeys.API_TOKEN, token.trim());
    onNext();
    setLoading(false);
  };

  return (
    <div className="w-full p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Enter API Token</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Get your token from the website settings
        </p>
      </div>

      <form onSubmit={handleTokenSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            API Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 clay-inset font-mono text-sm"
            placeholder="Enter your API token"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full clay-primary py-3 text-primary-foreground font-medium text-base disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <a
          href="http://localhost:5173/settings/api-tokens"
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          Get API token from website
        </a>
      </div>
    </div>
  );
}
