import { useEffect } from "react";

function RegionCapture() {
  useEffect(() => {
    const messageListener = async (request: any, sender: any, sendResponse: any) => {
      if (request.action === "startRegionCapture") {
        await startRegionCapture();
        sendResponse({ success: true });
        return true;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const startRegionCapture = async () => {
    // Create fullscreen dark overlay
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

    // Selection rectangle
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
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      
      selectionRect.style.left = `${startX}px`;
      selectionRect.style.top = `${startY}px`;
      selectionRect.style.width = '0px';
      selectionRect.style.height = '0px';
      selectionRect.style.display = 'block';
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
      isDrawing = false;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);

      // If selection is too small, ignore it
      if (width < 10 || height < 10) {
        overlay.remove();
        return;
      }

      // Create confirm button
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
        left: calc(50% + 120px);
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

      cancelButton.onclick = () => {
        overlay.remove();
      };

      confirmButton.onclick = async () => {
        confirmButton.disabled = true;
        confirmButton.textContent = "Capturing...";
        cancelButton.disabled = true;

        try {
          // Capture the entire visible tab first
          const captureResponse = await chrome.runtime.sendMessage({
            action: "captureVisibleTab"
          });

          if (!captureResponse.success) {
            alert("Failed to capture screen");
            confirmButton.disabled = false;
            confirmButton.textContent = "Send to AI";
            cancelButton.disabled = false;
            return;
          }

          // Now crop the captured image to the selected region
          const croppedImageDataUrl = await cropImage(
            captureResponse.imageDataUrl,
            left,
            top,
            width,
            height
          );

          // Send to sidepanel
          chrome.runtime.sendMessage({
            action: "regionCaptured",
            image: croppedImageDataUrl,
          });

          overlay.remove();
        } catch (error) {
          console.error("Capture failed:", error);
          alert("Failed to capture region");
          confirmButton.disabled = false;
          confirmButton.textContent = "Send to AI";
          cancelButton.disabled = false;
        }
      };

      overlay.appendChild(confirmButton);
      overlay.appendChild(cancelButton);
    };

    // Allow escape key to cancel
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);

    overlay.oncontextmenu = (e) => {
      e.preventDefault();
      overlay.remove();
      document.removeEventListener("keydown", handleEscape);
    };

    document.body.appendChild(overlay);
  };

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

  return <></>;
}

export default RegionCapture;
