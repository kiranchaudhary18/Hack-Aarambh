export const storageKeys = {
  API_TOKEN: "apiToken",
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
