// Auto-crop utility for smart cropping of captured images

export interface CropResult {
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Auto-crop an image by detecting content boundaries
 * This is a simplified version that removes whitespace from edges
 */
export function autoCropImage(
  imageData: string,
  threshold: number = 250
): Promise<CropResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      // Find content boundaries
      const bounds = findContentBounds(data, canvas.width, canvas.height, threshold);
      
      resolve({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        originalWidth: canvas.width,
        originalHeight: canvas.height,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageData;
  });
}

/**
 * Find the bounding box of non-transparent/non-white content
 */
function findContentBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): { x: number; y: number; width: number; height: number } {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      
      // Check if pixel is not transparent and not white
      const isContent = a > 0 && (r < threshold || g < threshold || b < threshold);
      
      if (isContent) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  // If no content found, return full image
  if (minX === width || minY === height) {
    return { x: 0, y: 0, width, height };
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Apply auto-crop to an image data URL
 */
export function applyAutoCrop(
  imageData: string,
  crop: CropResult
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = crop.width;
      canvas.height = crop.height;
      
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageData;
  });
}

/**
 * Smart auto-crop with margin preservation
 */
export async function smartAutoCrop(
  imageData: string,
  margin: number = 10,
  threshold: number = 250
): Promise<string> {
  try {
    const crop = await autoCropImage(imageData, threshold);
    
    // Add margin if possible
    const finalCrop: CropResult = {
      x: Math.max(0, crop.x - margin),
      y: Math.max(0, crop.y - margin),
      width: Math.min(crop.originalWidth - crop.x + margin, crop.width + margin * 2),
      height: Math.min(crop.originalHeight - crop.y + margin, crop.height + margin * 2),
      originalWidth: crop.originalWidth,
      originalHeight: crop.originalHeight,
    };
    
    // If crop is too small, return original
    if (finalCrop.width < crop.originalWidth * 0.1 || finalCrop.height < crop.originalHeight * 0.1) {
      return imageData;
    }
    
    return await applyAutoCrop(imageData, finalCrop);
  } catch (error) {
    console.error('Auto-crop failed:', error);
    return imageData; // Return original if auto-crop fails
  }
}
