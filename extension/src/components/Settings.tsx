import { useEffect, useState } from "react";
import { setItem, getItem, removeItem, clearRecentScans, storageKeys } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";

export default function Settings({ language }: { language: Language }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadToken() {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      setToken(apiToken || "");
    }

    loadToken();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setStatus(getTranslation(language, "apiToken"));
      return;
    }

    await setItem(storageKeys.API_TOKEN, token.trim());
    setStatus(getTranslation(language, "tokenSaved"));
  };

  const handleClearHistory = async () => {
    await clearRecentScans();
    setStatus(getTranslation(language, "historyCleared"));
  };

  const handleClearToken = async () => {
    await removeItem(storageKeys.API_TOKEN);
    setToken("");
    setStatus(getTranslation(language, "tokenCleared"));
  };

  return (
    <div className="w-full p-6 overflow-x-hidden">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{getTranslation(language, "settings")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {getTranslation(language, "settingsDescription")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
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
          />
        </div>

        {status && (
          <div className="text-sm text-foreground bg-muted p-3 rounded-lg">
            {status}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full clay-primary py-3 text-primary-foreground font-medium text-base"
          >
            {getTranslation(language, "save")}
          </button>
          <button
            type="button"
            onClick={handleClearToken}
            className="w-full clay-inset py-3 text-sm text-muted-foreground rounded-full"
          >
            {getTranslation(language, "clearApiToken")}
          </button>
          <button
            type="button"
            onClick={handleClearHistory}
            className="w-full clay-inset py-3 text-sm text-muted-foreground rounded-full"
          >
            {getTranslation(language, "clearHistory")}
          </button>
        </div>
      </form>
    </div>
  );
}
