import { useEffect } from "react";

function RegionCapture() {
  useEffect(() => {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "startRegionCapture") {
        startRegionCapture();
        sendResponse({ success: true });
      }
      return true;
    });
  }, []);

  const startRegionCapture = () => {
    // Create fullscreen dark overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
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
      const height = Math.abs(currentY);
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
      const height = Math.abs(currentY);
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);

      // Remove selection rectangle
      selectionRect.style.display = 'none';

      // If selection is too small, ignore it
      if (width < 10 || height < 10) {
        overlay.remove();
        return;
      }

      // Capture the selected region
      try {
        // Use html2canvas or similar approach to capture the region
        // For now, we'll use a simpler approach with html2canvas if available
        // or fallback to a basic implementation
        
        // Create a canvas to capture the region
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          // Capture the visible portion of the page
          // This is a simplified version - in production you'd want to use
          // html2canvas or a similar library for better results
          
          // For now, we'll try to capture using the browser's capabilities
          // This approach has limitations but works for basic use cases
          
          // Try to use the Screen Capture API if available
          try {
            // Request screen capture of the specific region
            const stream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                displaySurface: "browser",
              },
            });

            const video = document.createElement("video");
            video.srcObject = stream;
            await video.play();

            // Capture the frame
            ctx.drawImage(video, left, top, width, height, 0, 0, width, height);
            
            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
            
            const imageData = canvas.toDataURL("image/png");
            
            // Send the captured image to popup
            chrome.runtime.sendMessage({
              action: "regionCaptured",
              image: imageData,
            });
            
            overlay.remove();
          } catch (err) {
            // Fallback: try to use html2canvas if available
            console.error("Screen capture failed, trying fallback:", err);
            
            // Simple fallback: alert user that screen capture is needed
            alert("Screen capture permission required. Please allow screen capture when prompted.");
            overlay.remove();
          }
        }
      } catch (err) {
        console.error("Region capture failed:", err);
        overlay.remove();
      }
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

  return null;
}

export default RegionCapture;
