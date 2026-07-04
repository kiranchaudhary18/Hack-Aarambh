import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import RegionScanner from "../components/Scanner";
import History from "../components/History";
import Settings from "../components/Settings";
import Style from "../components/Style";
import { getItem, setItem, storageKeys } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";

type Screen = "scan" | "history" | "settings";
type Theme = "light" | "dark";

const NAV_BUTTONS: { key: Screen; labelKey: string }[] = [
  { key: "scan", labelKey: "scan" },
  { key: "history", labelKey: "history" },
  { key: "settings", labelKey: "settings" },
];

export default function IndexPopup() {
  const [screen, setScreen] = useState<Screen>("scan");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    async function loadSettings() {
      const savedTheme = await getItem(storageKeys.THEME);
      const savedLanguage = await getItem(storageKeys.LANGUAGE);

      if (savedTheme) {
        setTheme(savedTheme);
      }
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }

      setLoading(false);
    }

    loadSettings();
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">
          {getTranslation(language, "loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-full overflow-x-hidden relative">
      <Style theme={theme} />
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
        <div className="custom-select">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value as Language)}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="hi">HI</option>
            <option value="zh">ZH</option>
          </select>
        </div>

        <button onClick={toggleTheme} className="icon-btn">
          {theme === "light" ? (
            <Moon size={16} strokeWidth={2} />
          ) : (
            <Sun size={16} strokeWidth={2} />
          )}
        </button>
      </div>

      <div className="w-full p-4 pt-20 flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          {NAV_BUTTONS.map((button) => (
            <button
              key={button.key}
              onClick={() => setScreen(button.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                screen === button.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {getTranslation(language, button.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-x-hidden">
          {screen === "scan" && <RegionScanner language={language} />}
          {screen === "history" && <History language={language} />}
          {screen === "settings" && <Settings language={language} />}
        </div>
      </div>
    </div>
  );
}
