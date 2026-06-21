import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import TokenInput from "../components/Input";
import RegionScanner from "../components/Scanner";
import Style from "../components/Style";
import { getItem, removeItem, storageKeys, setItem } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";

type Screen = "token" | "scan";
type Theme = "light" | "dark";

export default function IndexPopup() {
  const [screen, setScreen] = useState<Screen>("token");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    async function checkApiToken() {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      const savedTheme = await getItem(storageKeys.THEME);
      const savedLanguage = await getItem(storageKeys.LANGUAGE);

      if (apiToken) {
        setScreen("scan");
      } else {
        setScreen("token");
      }

      if (savedTheme) {
        setTheme(savedTheme);
      }

      if (savedLanguage) {
        setLanguage(savedLanguage);
      }

      setLoading(false);
    }

    checkApiToken();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await setItem(storageKeys.THEME, newTheme);
  };

  const changeLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    await setItem(storageKeys.LANGUAGE, newLanguage);
  };

  const handleLogout = async () => {
    await removeItem(storageKeys.API_TOKEN);
    setScreen("token");
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">{getTranslation(language, "loading")}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-full overflow-x-hidden relative">
      <Style theme={theme} />
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value as Language)}
          className="px-2 py-1 clay-inset text-xs rounded-full border border-border"
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
          <option value="de">DE</option>
          <option value="hi">HI</option>
          <option value="zh">ZH</option>
        </select>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 clay-inset rounded-full flex items-center justify-center text-sm border border-border"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
      {screen === "token" && (
        <TokenInput onNext={() => setScreen("scan")} language={language} />
      )}
      {screen === "scan" && (
        <div className="h-full flex flex-col">
          <RegionScanner onLogout={handleLogout} language={language} />
        </div>
      )}
    </div>
  );
}
