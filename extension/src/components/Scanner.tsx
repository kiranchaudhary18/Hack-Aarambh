import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { getItem, removeItem, storageKeys } from "../lib/storage";

export default function RegionScanner({ onLogout }: { onLogout: () => void }) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Listen for captured region from content script
    const listener = (request: any, sender: chrome.runtime.MessageSender) => {
      if (request.action === "regionCaptured" && request.image) {
        setCapturedImage(request.image);
        // Automatically analyze when region is captured
        analyzeImage(request.image);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleScanArea = async () => {
    try {
      setError("");
      // Send message to content script to start region capture
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        setError("No active tab found");
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { action: "startRegionCapture" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Content script error:", chrome.runtime.lastError);
            setError("Content script not loaded. Please refresh the page and try again.");
          }
        }
      );
    } catch (err) {
      console.error("Scan area error:", err);
      setError("Failed to start region capture. Please try again.");
    }
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    setError("");
    
    try {
      const apiToken = await getItem(storageKeys.API_TOKEN);
      if (!apiToken) {
        setError("API token not found. Please add your API token.");
        setAnalyzing(false);
        return;
      }
      
      const response = await api.analyzeImage(imageData, apiToken);
      
      if (response.success) {
        // Redirect to history page on website
        chrome.tabs.create({ url: "http://localhost:5173/history" });
        window.close();
      } else {
        setError(response.error || "Analysis failed");
      }
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full p-6 flex-1 flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Scan Area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select any region on the screen to analyze
        </p>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleScanArea}
            disabled={analyzing}
            className="w-auto px-6 clay-primary py-2 text-primary-foreground font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {analyzing ? "Analyzing..." : "Scan Area"}
          </button>

          <button
            onClick={onLogout}
            className="w-auto px-6 clay-inset py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear API Token
          </button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
            {error}
          </div>
        )}

        {capturedImage && (
          <div className="clay rounded-lg overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured region"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
