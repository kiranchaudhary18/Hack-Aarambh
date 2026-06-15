import { useState } from "react";
import { setItem, storageKeys } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";

export default function TokenInput({ onNext, language }: { onNext: () => void; language: Language }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token.trim()) {
      setError(getTranslation(language, "apiToken"));
      setLoading(false);
      return;
    }

    // Store the token
    await setItem(storageKeys.API_TOKEN, token.trim());
    onNext();
    setLoading(false);
  };

  return (
    <div className="w-full p-6 overflow-x-hidden">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{getTranslation(language, "enterApiToken")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {getTranslation(language, "enterApiTokenDescription")}
        </p>
      </div>

      <form onSubmit={handleTokenSubmit} className="space-y-4 overflow-x-hidden">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {getTranslation(language, "apiToken")}
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 clay-inset font-mono text-sm"
            placeholder={getTranslation(language, "apiToken")}
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
          {loading ? "Saving..." : getTranslation(language, "continue")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <a
          href="http://localhost:5173/settings/api-tokens"
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          {getTranslation(language, "getApiToken")}
        </a>
      </div>
    </div>
  );
}
