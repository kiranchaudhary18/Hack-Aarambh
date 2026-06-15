import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { getItem, removeItem, storageKeys, addRecentScan, getRecentScans } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";
import { LogOut, Send, Scan } from "lucide-react";

interface RecentScan {
  id: number;
  image: string;
  timestamp: string;
}

export default function RegionScanner({ onLogout, language }: { onLogout: () => void; language: Language }) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    loadRecentScans();

    const listener = (request: any, sender: chrome.runtime.MessageSender) => {
      if (request.action === "regionCaptured" && request.image) {
        setCapturedImage(request.image);
        setAnalysisComplete(false);
        setAnalysisResult(null);
        addRecentScan(request.image);
        loadRecentScans();
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const loadRecentScans = async () => {
    const scans = await getRecentScans();
    setRecentScans(scans);
  };

  const handleScanArea = async () => {
    try {
      setError("");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id) {
        setError(getTranslation(language, "noActiveTab"));
        return;
      }

      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contents/capture.js"],
      });

      // Start capture
      await chrome.tabs.sendMessage(tab.id, { action: "startRegionCapture" });
    } catch (err) {
      console.error("Scan error:", err);
      setError(getTranslation(language, "scanAreaError"));
    }
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    setError("");
    setAnalysisComplete(false);
    setAnalysisResult(null);

    try {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      if (!apiToken) {
        setError(getTranslation(language, "apiTokenNotFound"));
        setAnalyzing(false);
        return;
      }

      const response = await api.analyzeImage(imageData, apiToken);

      if (response.success) {
        setAnalysisComplete(true);
        setAnalysisResult(response.result);
      } else {
        setError(response.error || getTranslation(language, "analysisFailed"));
      }
    } catch (err) {
      console.error(err);
      setError(getTranslation(language, "analysisFailed"));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadRecentScan = (scan: RecentScan) => {
    setCapturedImage(scan.image);
    setAnalysisComplete(false);
    setAnalysisResult(null);
  };

  return (
    <div className="w-full p-6 flex-1 flex flex-col overflow-x-hidden">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Scan Area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select an area to scan for scams
        </p>
      </div>

      <div className="space-y-4 flex-1 overflow-x-hidden">
        {/* Capture button */}
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={handleScanArea}
            disabled={analyzing}
            className="w-auto px-6 clay-primary py-3 text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap text-sm rounded-full"
          >
            <Scan className="w-5 h-5" />
            {analyzing ? "Analyzing..." : "Scan Region"}
          </button>

          <button
            onClick={onLogout}
            className="w-auto px-4 py-2 clay-inset text-muted-foreground whitespace-nowrap text-xs rounded-full"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Clear Token
          </button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && !capturedImage && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Recent Scans</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => handleLoadRecentScan(scan)}
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors clay-inset"
                >
                  <img
                    src={scan.image}
                    alt="Recent scan"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Captured Image */}
        {capturedImage && !analyzing && !analysisComplete && (
          <div className="space-y-4">
            <div className="clay rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
            <button
              onClick={() => analyzeImage(capturedImage)}
              className="w-full clay-primary py-3 text-primary-foreground font-medium flex items-center justify-center gap-2 text-sm rounded-full"
            >
              <Send className="w-5 h-5" />
              Send to AI
            </button>
            <button
              onClick={() => {
                setCapturedImage(null);
                setAnalysisResult(null);
                setAnalysisComplete(false);
              }}
              className="w-full clay-inset py-2 text-sm text-muted-foreground rounded-full"
            >
              Scan New Area
            </button>
          </div>
        )}

        {/* Analyzing */}
        {analyzing && (
          <div className="clay rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center">Analyzing...</p>
          </div>
        )}

        {/* Analysis Complete */}
        {analysisComplete && analysisResult && (
          <div className="clay rounded-lg p-6 space-y-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                analysisResult.isFake ? "bg-red-500/20" : "bg-green-500/20"
              }`}>
                <span className={`text-2xl font-bold ${
                  analysisResult.isFake ? "text-red-500" : "text-green-500"
                }`}>
                  {analysisResult.score}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {analysisResult.isFake ? "⚠️ Potential Scam Detected" : "✅ Looks Safe"}
              </h3>
            </div>
            
            {analysisResult.reasons && analysisResult.reasons.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Reasons:</h4>
                <ul className="space-y-1">
                  {analysisResult.reasons.map((reason: string, i: number) => (
                    <li key={i} className="text-sm text-foreground clay-inset p-2 rounded">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => analyzeImage(capturedImage!)}
                className="flex-1 clay-inset py-2 text-sm text-muted-foreground rounded-full"
              >
                Re-analyze
              </button>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setAnalysisResult(null);
                  setAnalysisComplete(false);
                }}
                className="flex-1 clay-primary py-2 text-sm text-primary-foreground rounded-full"
              >
                New Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
