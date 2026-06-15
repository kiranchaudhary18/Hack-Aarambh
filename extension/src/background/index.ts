// Background service worker for ScamSniff extension

chrome.runtime.onInstalled.addListener(() => {
  console.log("ScamSniff extension installed");
});

// Handle extension icon click - open side panel
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab.id) {
      await chrome.sidePanel.open({ tabId: tab.id });
    } else if (tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  } catch (error) {
    console.error("Failed to open side panel:", error);
  }
});

// Handle messages from content scripts and sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureVisibleTab") {
    (async () => {
      try {
        const tabId = request.tabId || sender.tab?.id;
        if (!tabId) {
          sendResponse({ success: false, error: "No active tab" });
          return;
        }

        const imageDataUrl = await chrome.tabs.captureVisibleTab(
          sender.tab?.windowId,
          { format: "png" },
        );
        sendResponse({ success: true, imageDataUrl });
      } catch (error) {
        console.error("Capture failed:", error);
        sendResponse({ success: false, error: "Failed to capture tab" });
      }
    })();
    return true; // Keep channel open for async response
  } else if (request.action === "regionCaptured") {
    // Handle single region captured
    console.log("Region captured");
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});
