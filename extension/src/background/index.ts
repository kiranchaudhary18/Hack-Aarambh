// Background service worker for ScamSniff extension

chrome.runtime.onInstalled.addListener(() => {
  console.log("ScamSniff extension installed");
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureImage") {
    // Handle image capture request
    sendResponse({ success: true });
  }
  return true;
});
