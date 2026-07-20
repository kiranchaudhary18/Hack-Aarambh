export const storageKeys = {
  API_TOKEN: "apiToken",
  RECENT_SCANS: "recentScans",
  THEME: "theme",
  LANGUAGE: "language",
};

export const setItem = async (key: string, value: any) => {
  await chrome.storage.local.set({ [key]: value });
};

export const getItem = async (key: string) => {
  const result = await chrome.storage.local.get(key);
  return result[key];
};

export const removeItem = async (key: string) => {
  await chrome.storage.local.remove(key);
};

export const clearAll = async () => {
  await chrome.storage.local.clear();
};

// Recent scans management
export const addRecentScan = async (imageData: string) => {
  const recentScans = (await getItem(storageKeys.RECENT_SCANS)) || [];
  const newScan = {
    id: Date.now(),
    image: imageData,
    timestamp: new Date().toISOString(),
    analysisResult: null,
  };

  const updatedScans = [newScan, ...recentScans].slice(0, 20);
  await setItem(storageKeys.RECENT_SCANS, updatedScans);
  return newScan;
};

export const updateRecentScanAnalysis = async (scanId: number, analysisResult: any) => {
  const recentScans = (await getItem(storageKeys.RECENT_SCANS)) || [];
  const updatedScans = recentScans.map((scan: any) => {
    if (scan.id === scanId) {
      return {
        ...scan,
        analysisResult,
      };
    }
    return scan;
  });

  await setItem(storageKeys.RECENT_SCANS, updatedScans);
  return updatedScans.find((scan: any) => scan.id === scanId) || null;
};

export const getRecentScans = async () => {
  return (await getItem(storageKeys.RECENT_SCANS)) || [];
};

export const clearRecentScans = async () => {
  await removeItem(storageKeys.RECENT_SCANS);
};
