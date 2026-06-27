/// <reference types="chrome" />

// Background service worker for ScamSniff extension

chrome.runtime.onInstalled.addListener(() => {
  console.log("ScamSniff extension installed");
});

// Handle extension icon click - open side panel
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
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
const injectCaptureContentScript = async (tabId: number) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        console.log("[Injected] Script injected into page");
        if ((window as any).__scamSniffCaptureInjected__) {
          console.log("[Injected] Already injected, skipping");
          return;
        }
        (window as any).__scamSniffCaptureInjected__ = true;
        console.log("[Injected] First time injection, setting up capture handler");

        const cropImage = async (imageDataUrl: string, x: number, y: number, width: number, height: number): Promise<string> => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
                resolve(canvas.toDataURL("image/png"));
              } else {
                resolve(imageDataUrl);
              }
            };
            img.src = imageDataUrl;
          });
        };

        const startRegionCapture = async () => {
          console.log("[Injected] startRegionCapture function called");
          const overlay = document.createElement("div");
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483647;
            cursor: crosshair;
          `;

          const selectionRect = document.createElement("div");
          selectionRect.style.cssText = `
            position: absolute;
            border: 2px solid #3b82f6;
            background: rgba(59, 130, 246, 0.2);
            pointer-events: none;
            display: none;
          `;
          overlay.appendChild(selectionRect);

          let isDrawing = false;
          let startX = 0;
          let startY = 0;

          overlay.onmousedown = (e: MouseEvent) => {
            console.log("[Injected] Mouse DOWN at", e.clientX, e.clientY);
            isDrawing = true;
            startX = e.clientX;
            startY = e.clientY;
            selectionRect.style.left = `${startX}px`;
            selectionRect.style.top = `${startY}px`;
            selectionRect.style.width = "0px";
            selectionRect.style.height = "0px";
            selectionRect.style.display = "block";
          };

          overlay.onmousemove = (e: MouseEvent) => {
            if (!isDrawing) return;
            const currentX = e.clientX;
            const currentY = e.clientY;
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);
            selectionRect.style.left = `${left}px`;
            selectionRect.style.top = `${top}px`;
            selectionRect.style.width = `${width}px`;
            selectionRect.style.height = `${height}px`;
          };

          overlay.onmouseup = async (e: MouseEvent) => {
            console.log("[Injected] Mouse UP detected");
            isDrawing = false;
            const currentX = e.clientX;
            const currentY = e.clientY;
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);

            console.log("[Injected] Selection size: width=" + width + " height=" + height);

            if (width < 10 || height < 10) {
              console.log("[Injected] Selection too small, ignoring");
              overlay.remove();
              return;
            }

            console.log("[Injected] Selection valid, creating buttons");

            const confirmButton = document.createElement("button");
            confirmButton.textContent = "Send to AI";
            confirmButton.style.cssText = `
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              padding: 12px 24px;
              background: linear-gradient(145deg, #8b5cf6, #7c3aed);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              z-index: 2147483648;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.style.cssText = `
              position: absolute;
              bottom: 20px;
              left: calc(50% + 140px);
              transform: translateX(-50%);
              padding: 12px 24px;
              background: rgba(255, 255, 255, 0.9);
              color: #374151;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              z-index: 2147483648;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;

            console.log("[Injected] Creating buttons for confirm/cancel");

            cancelButton.onclick = (e) => {
              console.log("[Injected] Cancel button clicked");
              e.stopPropagation();
              overlay.remove();
            };

            confirmButton.onclick = async (e) => {
              console.log("[Injected] CONFIRM BUTTON CLICKED!");
              e.stopPropagation();
              e.preventDefault();
              confirmButton.disabled = true;
              confirmButton.textContent = "Capturing...";
              cancelButton.disabled = true;
              try {
                console.log("[Injected] Send to AI clicked, requesting captureVisibleTab");
                const captureResponse = await chrome.runtime.sendMessage({ action: "captureVisibleTab" });
                console.log("[Injected] captureVisibleTab response:", captureResponse);
                if (!captureResponse?.success) {
                  console.error("[Injected] Capture failed - not successful");
                  alert("Failed to capture screen");
                  confirmButton.disabled = false;
                  confirmButton.textContent = "Send to AI";
                  cancelButton.disabled = false;
                  return;
                }
                console.log("[Injected] Starting to crop image, area: left=" + left + " top=" + top + " width=" + width + " height=" + height);
                const croppedImageDataUrl = await cropImage(captureResponse.imageDataUrl, left, top, width, height);
                console.log("[Injected] Image cropped, sending regionCaptured message, image data length:", croppedImageDataUrl?.length || 0);
                chrome.runtime.sendMessage({ action: "regionCaptured", image: croppedImageDataUrl }, (response) => {
                  console.log("[Injected] regionCaptured response from background:", response);
                  if (chrome.runtime.lastError) {
                    console.error("[Injected] regionCaptured send error:", chrome.runtime.lastError.message);
                  }
                });
                overlay.remove();
              } catch (error) {
                console.error("[Injected] Capture failed:", error);
                alert("Failed to capture region");
                confirmButton.disabled = false;
                confirmButton.textContent = "Send to AI";
                cancelButton.disabled = false;
              }
            };

            overlay.appendChild(confirmButton);
            overlay.appendChild(cancelButton);
          };

          const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
              overlay.remove();
              document.removeEventListener("keydown", handleEscape);
            }
          };
          document.addEventListener("keydown", handleEscape);

          overlay.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
            overlay.remove();
            document.removeEventListener("keydown", handleEscape);
          };

          console.log("[Injected] Appending overlay to document.body");
          document.body.appendChild(overlay);
          console.log("[Injected] Overlay appended successfully, waiting for user interaction");
        };

        console.log("[Injected] Setting up message listener for startRegionCapture");
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          console.log("[Injected] Message received in listener:", request);
          if (request?.action === "startRegionCapture") {
            console.log("[Injected] startRegionCapture message received, calling startRegionCapture()");
            startRegionCapture().then(() => sendResponse({ success: true })).catch((error) => {
              console.error("Injected startRegionCapture failed:", error);
              sendResponse({ success: false, error: String(error) });
            });
            return true;
          }
        });
      },
    });
  } catch (injectError) {
    console.error("Failed to inject capture content script:", injectError);
    throw injectError;
  }
};

chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  if (request.action === "startScan") {
    (async () => {
      try {
        console.log("Background: startScan called, tabId:", request.tabId);
        if (typeof request.tabId !== "number") {
          throw new Error("Missing tabId for startScan");
        }

        const sendToTab = async () => {
          return new Promise<void>((resolve, reject) => {
            chrome.tabs.sendMessage(request.tabId, { action: "startRegionCapture" }, (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                console.log("startRegionCapture sent to tab", response);
                resolve();
              }
            });
          });
        };

        try {
          await sendToTab();
        } catch (sendError) {
          console.warn("startRegionCapture send failed, attempting content script injection:", sendError);
          await injectCaptureContentScript(request.tabId);
          await sendToTab();
        }

        sendResponse({ success: true });
      } catch (error) {
        console.error("Start scan failed in background:", error);
        sendResponse({ success: false, error: String(error) });
      }
    })();
    return true; // Keep channel open for async response
  } else if (request.action === "captureVisibleTab") {
    (async () => {
      try {
        const tabId = request.tabId || sender.tab?.id;
        if (!tabId) {
          sendResponse({ success: false, error: "No active tab" });
          return;
        }

        let windowId = sender.tab?.windowId;
        if (!windowId) {
          try {
            const tabInfo = await chrome.tabs.get(tabId);
            windowId = tabInfo.windowId;
          } catch (windowError) {
            console.warn("Failed to resolve tab windowId", windowError);
          }
        }

        const captureOptions = { format: "png" };
        const imageDataUrl = await new Promise<string>((resolve, reject) => {
          const callback = (dataUrl: string) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(dataUrl);
            }
          };

          if (typeof windowId === "number") {
            chrome.tabs.captureVisibleTab(windowId, captureOptions, callback);
          } else {
            chrome.tabs.captureVisibleTab(captureOptions, callback);
          }
        });

        sendResponse({ success: true, imageDataUrl });
      } catch (error) {
        console.error("Capture failed:", error);
        sendResponse({ success: false, error: "Failed to capture tab" });
      }
    })();
    return true; // Keep channel open for async response
  } else if (request.action === "regionCaptured") {
    console.log("Background: Region captured received from injected script, image size:", request.image?.length || 0);
    console.log("Background: Forwarding to sidepanel");
    chrome.runtime.sendMessage(
      {
        action: "regionCaptured",
        image: request.image,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Background: Error forwarding regionCaptured to sidepanel:", chrome.runtime.lastError.message);
        } else {
          console.log("Background: regionCaptured forwarded to sidepanel, response:", response);
        }
      },
    );
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});
