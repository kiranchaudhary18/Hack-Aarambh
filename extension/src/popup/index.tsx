import { useState, useEffect } from "react";
import TokenInput from "../components/Input";
import RegionScanner from "../components/Scanner";
import Style from "../components/Style";
import { getItem, removeItem, storageKeys } from "../lib/storage";

type Screen = "token" | "scan";

export default function IndexPopup() {
  const [screen, setScreen] = useState<Screen>("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkApiToken() {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      
      if (apiToken) {
        setScreen("scan");
      } else {
        setScreen("token");
      }
      setLoading(false);
    }

    checkApiToken();
  }, []);

  const handleLogout = async () => {
    await removeItem(storageKeys.API_TOKEN);
    setScreen("token");
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] max-w-[400px]">
      <Style />
      {screen === "token" && (
        <TokenInput onNext={() => setScreen("scan")} />
      )}
      {screen === "scan" && (
        <div className="h-full flex flex-col">
          <RegionScanner onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}
