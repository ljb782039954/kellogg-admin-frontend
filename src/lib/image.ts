/**
 * Resizes an image file to a target width while maintaining aspect ratio.
 * @param file The original image file
 * @param maxWidth The target maximum width
 * @returns A Promise that resolves to the resized File object, or the original if it's already smaller
 */
export async function resizeImage(file: File, maxWidth: number): Promise<File> {
  // Return original file if it's not an image
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

        // If the image is already smaller than maxWidth, return original
        if (width <= maxWidth) {
          resolve(file);
          return;
        }

        // Calculate new dimensions
        height = (height * maxWidth) / width;
        width = maxWidth;

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to File
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
          0.85 // Quality: 0.85 is a good balance for web
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
