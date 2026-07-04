import { useEffect, useState } from "react";
import { getRecentScans } from "../lib/storage";
import { Language, getTranslation } from "../lib/translations";

interface RecentScan {
  id: number;
  image: string;
  timestamp: string;
  analysisResult?: {
    score: number;
    isFake: boolean;
    reasons?: string[];
  } | null;
}

export default function History({ language }: { language: Language }) {
  const [history, setHistory] = useState<RecentScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<RecentScan | null>(null);

  useEffect(() => {
    async function loadHistory() {
      const scans = await getRecentScans();
      setHistory(scans);
      if (scans.length > 0) {
        setSelectedScan(scans[0]);
      }
    }

    loadHistory();
  }, []);

  const handleSelectScan = (scan: RecentScan) => {
    setSelectedScan(scan);
  };

  return (
    <div className="w-full p-6 flex flex-col gap-4 overflow-hidden">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-foreground">{getTranslation(language, "history")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {getTranslation(language, "historyDescription")}
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        {history.length === 0 ? (
          <div className="clay rounded-3xl p-6 text-sm text-muted-foreground">
            {getTranslation(language, "noScansYet")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.3fr] overflow-hidden">
            <div className="space-y-3 overflow-y-auto max-h-[480px] pr-2">
              {history.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => handleSelectScan(scan)}
                  className={`w-full text-left p-3 rounded-3xl transition border ${
                    selectedScan?.id === scan.id ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-3xl overflow-hidden bg-muted">
                      <img src={scan.image} alt="Scan thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{new Date(scan.timestamp).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {scan.analysisResult ? `${scan.analysisResult.score}%` : getTranslation(language, "pendingAnalysis")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="clay rounded-3xl p-4 overflow-hidden">
              {selectedScan ? (
                <>
                  <div className="rounded-3xl overflow-hidden mb-4 border border-border">
                    <img src={selectedScan.image} alt="Selected scan" className="w-full h-64 object-contain bg-black/5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{getTranslation(language, "scannedAt")}</p>
                        <p className="text-base font-semibold text-foreground">{new Date(selectedScan.timestamp).toLocaleString()}</p>
                      </div>
                      <div className={`text-sm font-semibold ${
                        selectedScan.analysisResult?.isFake ? "text-red-500" : "text-green-500"
                      }`}>
                        {selectedScan.analysisResult ? (selectedScan.analysisResult.isFake ? getTranslation(language, "potentialScam") : getTranslation(language, "looksSafe")) : getTranslation(language, "pendingAnalysis")}
                      </div>
                    </div>

                    {selectedScan.analysisResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{getTranslation(language, "score")}</span>
                          <span className="text-lg font-bold text-foreground">{selectedScan.analysisResult.score}%</span>
                        </div>

                        {selectedScan.analysisResult.reasons?.length ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{getTranslation(language, "reasons")}</p>
                            <ul className="space-y-2">
                              {selectedScan.analysisResult.reasons.map((reason, index) => (
                                <li key={index} className="text-sm text-foreground clay-inset p-3 rounded-2xl">
                                  • {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{getTranslation(language, "noDetailedReasons")}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {getTranslation(language, "pendingAnalysisDescription")}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
