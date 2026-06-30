import { useEffect } from "react";

function RegionCapture() {
  useEffect(() => {
    const messageListener = async (
      request: any,
      sendResponse: any,
    ) => {
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
    const overlay = document.createElement("div");

    overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    z-index:2147483647;
    cursor:crosshair;
  `;

    const selectionRect = document.createElement("div");

    selectionRect.style.cssText = `
    position:absolute;
    border:2px solid #3b82f6;
    background:rgba(59,130,246,.18);
    display:none;
    pointer-events:none;
  `;

    overlay.appendChild(selectionRect);

    let isDrawing = false;
    let selectionDone = false;

    let startX = 0;
    let startY = 0;

    let left = 0;
    let top = 0;
    let width = 0;
    let height = 0;

    overlay.addEventListener("mousedown", (e) => {
      if (selectionDone) return;

      isDrawing = true;

      startX = e.clientX;
      startY = e.clientY;

      selectionRect.style.display = "block";
      selectionRect.style.left = `${startX}px`;
      selectionRect.style.top = `${startY}px`;
      selectionRect.style.width = "0px";
      selectionRect.style.height = "0px";
    });

    overlay.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;

      width = Math.abs(e.clientX - startX);
      height = Math.abs(e.clientY - startY);

      left = Math.min(startX, e.clientX);
      top = Math.min(startY, e.clientY);

      selectionRect.style.left = `${left}px`;
      selectionRect.style.top = `${top}px`;
      selectionRect.style.width = `${width}px`;
      selectionRect.style.height = `${height}px`;
    });

    overlay.addEventListener("mouseup", () => {
      if (!isDrawing || selectionDone) return;

      isDrawing = false;

      if (width < 10 || height < 10) {
        selectionRect.style.display = "none";
        return;
      }

      selectionDone = true;
      overlay.style.cursor = "default";

      const buttonContainer = document.createElement("div");

      buttonContainer.style.cssText = `
      position:fixed;
      bottom:25px;
      left:50%;
      transform:translateX(-50%);
      display:flex;
      gap:12px;
      z-index:2147483648;
    `;

      const confirmButton = document.createElement("button");

      confirmButton.textContent = "Send to AI";

      confirmButton.style.cssText = `
      padding:12px 26px;
      border:none;
      border-radius:10px;
      background:#8b5cf6;
      color:white;
      font-weight:600;
      cursor:pointer;
    `;

      const cancelButton = document.createElement("button");

      cancelButton.textContent = "Cancel";

      cancelButton.style.cssText = `
      padding:12px 26px;
      border-radius:10px;
      border:1px solid #ccc;
      background:white;
      cursor:pointer;
    `;

      buttonContainer.append(confirmButton, cancelButton);

      overlay.appendChild(buttonContainer);

      cancelButton.addEventListener("click", (e) => {
        e.stopPropagation();
        document.removeEventListener("keydown", handleEscape);
        overlay.remove();
      });

      confirmButton.addEventListener("click", async (e) => {
        e.stopPropagation();
        confirmButton.disabled = true;
        confirmButton.textContent = "Capturing...";

        try {
          const captureResponse = await chrome.runtime.sendMessage({
            action: "captureVisibleTab",
          });

          if (!captureResponse.success) {
            confirmButton.disabled = false;
            confirmButton.textContent = "Send to AI";
            return;
          }

          const croppedImageDataUrl = await cropImage(
            captureResponse.imageDataUrl,
            left,
            top,
            width,
            height,
          );

          chrome.runtime.sendMessage({
            action: "regionCaptured",
            image: croppedImageDataUrl,
          });

          document.removeEventListener("keydown", handleEscape);
          overlay.remove();
        } catch (err) {
          console.error(err);

          confirmButton.disabled = false;
          confirmButton.textContent = "Send to AI";
        }
      });
    });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.removeEventListener("keydown", handleEscape);
        overlay.remove();
      }
    };

    document.addEventListener("keydown", handleEscape);

    overlay.oncontextmenu = (e) => {
      e.preventDefault();
    };

    document.body.appendChild(overlay);
  };


  const cropImage = async (
    imageDataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<string> => {
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
