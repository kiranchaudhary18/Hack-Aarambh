import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { getItem, storageKeys, addRecentScan, getRecentScans, updateRecentScanAnalysis } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";
import { Send, Scan } from "lucide-react";

interface RecentScan {
  id: number;
  image: string;
  timestamp: string;
  analysisResult?: any;
}

export default function RegionScanner({ language }: { language: Language }) {
  const [selectedScan, setSelectedScan] = useState<RecentScan | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecentScans();

    const listener = (request: any, sender: chrome.runtime.MessageSender) => {
      if (request.action === "regionCaptured" && request.image) {
        handleCapturedRegion(request.image);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const loadRecentScans = async () => {
    const scans = await getRecentScans();
    setRecentScans(scans);
  };

  const handleCapturedRegion = async (imageData: string) => {
    setError("");
    const scan = await addRecentScan(imageData);
    setSelectedScan(scan);
    await loadRecentScans();
  };

  const handleScanArea = async () => {
    try {
      setError("");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setError(getTranslation(language, "noActiveTab"));
        return;
      }

      const response = await chrome.runtime.sendMessage({
        action: "startScan",
        tabId: tab.id,
      });

      if (!response?.success) {
        setError(response?.error || getTranslation(language, "scanAreaError"));
      }
    } catch (err) {
      setError(getTranslation(language, "scanAreaError"));
    }
  };

  const handleAnalyzeCurrentScan = async () => {
    if (!selectedScan) {
      setError(getTranslation(language, "selectScanFirst"));
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      if (!apiToken) {
        setError(getTranslation(language, "apiTokenNotFound"));
        return;
      }

      const response = await api.analyzeImage(selectedScan.image, apiToken);
      if (response.success) {
        const updatedScan = await updateRecentScanAnalysis(selectedScan.id, response.result);
        setSelectedScan(updatedScan);
        await loadRecentScans();
      } else {
        setError(response.error || getTranslation(language, "analysisFailed"));
      }
    } catch (err) {
      setError(getTranslation(language, "analysisFailed"));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectRecentScan = (scan: RecentScan) => {
    setSelectedScan(scan);
    setError("");
  };

  const analysisResult = selectedScan?.analysisResult || null;
  const analysisComplete = !!analysisResult;

  return (
    <div className="w-full p-6 flex-1 flex flex-col overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{getTranslation(language, "scanArea")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {getTranslation(language, "scanAreaDescription")}
        </p>
      </div>

      <div className="space-y-4 flex-1 overflow-hidden">
        <div className="flex justify-center">
          <button
            onClick={handleScanArea}
            disabled={analyzing}
            className="w-full max-w-sm px-8 py-4 clay-primary text-primary-foreground font-semibold text-base rounded-full shadow-sm hover:opacity-95 disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <Scan className="w-5 h-5" />
              {getTranslation(language, "scan")}
            </span>
          </button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {selectedScan && (
          <div className="space-y-4">
            <div className="clay rounded-3xl overflow-hidden border border-border">
              <img
                src={selectedScan.image}
                alt="Selected scan"
                className="w-full h-auto max-h-72 object-contain"
              />
            </div>

            <div className="flex flex-col gap-3">
              {!analysisComplete ? (
                <button
                  onClick={handleAnalyzeCurrentScan}
                  disabled={analyzing}
                  className="w-full clay-primary py-3 text-primary-foreground font-medium rounded-full"
                >
                  {analyzing ? getTranslation(language, "analyzing") : getTranslation(language, "sendToAI")}
                </button>
              ) : (
                <div className="clay rounded-3xl p-4 space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                      analysisResult.isFake ? "bg-red-500/20" : "bg-green-500/20"
                    }`}>
                      <span className={`text-2xl font-bold ${
                        analysisResult.isFake ? "text-red-500" : "text-green-500"
                      }`}>
                        {analysisResult.score}%
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {analysisResult.isFake ? getTranslation(language, "potentialScam") : getTranslation(language, "looksSafe")}
                    </h3>
                  </div>

                  {analysisResult.reasons && analysisResult.reasons.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{getTranslation(language, "reasons")}</h4>
                      <ul className="space-y-1">
                        {analysisResult.reasons.map((reason: string, i: number) => (
                          <li key={i} className="text-sm text-foreground clay-inset p-3 rounded-2xl">
                            • {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  onClick={() => setSelectedScan(null)}
                  className="flex-1 clay-inset py-3 text-sm text-muted-foreground rounded-full"
                >
                  {getTranslation(language, "scanNewArea")}
                </button>
                {analysisComplete && (
                  <button
                    onClick={handleAnalyzeCurrentScan}
                    className="flex-1 clay-primary py-3 text-primary-foreground text-sm rounded-full"
                  >
                    {getTranslation(language, "reanalyze")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{getTranslation(language, "recentScans")}</h3>
            <span className="text-xs text-muted-foreground">{recentScans.length} {getTranslation(language, "items")}</span>
          </div>
          <div className="grid grid-cols-4 gap-3 overflow-x-auto pb-2">
            {recentScans.length === 0 ? (
              <div className="col-span-4 text-sm text-muted-foreground">{getTranslation(language, "noScansYet")}</div>
            ) : (
              recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => handleSelectRecentScan(scan)}
                  className={`rounded-3xl overflow-hidden border transition ${
                    selectedScan?.id === scan.id ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={scan.image} alt="Recent scan" className="w-full h-20 object-cover" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
