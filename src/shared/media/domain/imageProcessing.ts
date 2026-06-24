/**
 * Resizes an image file to a target width while maintaining aspect ratio.
 * @param file The original image file
 * @param maxWidth The target maximum width
 * @returns A Promise that resolves to the resized File object, or the original if it's already smaller
 */
export async function resizeImage(file: File, maxWidth: number): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        if (width <= maxWidth) {
          resolve(file);
          return;
        }

        height = (height * maxWidth) / width;
        width = maxWidth;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          file.type,
          0.85,
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Calculates a 64-bit Average Hash (aHash) for an image file.
 * Returns a 64-character string of '0' and '1'.
 */
export async function calculateImageHash(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return '';
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 8;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        ctx.drawImage(img, 0, 0, 8, 8);
        let imgData: ImageData;
        try {
          imgData = ctx.getImageData(0, 0, 8, 8);
        } catch {
          resolve('');
          return;
        }

        const { data } = imgData;
        let sum = 0;
        const grays = new Uint8Array(64);

        for (let i = 0; i < 64; i += 1) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
          grays[i] = gray;
          sum += gray;
        }

        const avg = sum / 64;
        let hash = '';
        for (let i = 0; i < 64; i += 1) {
          hash += grays[i] >= avg ? '1' : '0';
        }
        resolve(hash);
      };
      img.onerror = () => resolve('');
    };
    reader.onerror = () => resolve('');
  });
}

/**
 * Calculates similarity between two aHash strings (value between 0 and 1).
 */
export function calculateHashSimilarity(hash1: string, hash2: string): number {
  if (!hash1 || !hash2 || hash1.length !== 64 || hash2.length !== 64) {
    return 0;
  }
  let diff = 0;
  for (let i = 0; i < 64; i += 1) {
    if (hash1[i] !== hash2[i]) {
      diff += 1;
    }
  }
  return 1 - diff / 64;
}
