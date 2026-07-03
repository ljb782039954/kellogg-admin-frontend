export async function getImageDimensions(file: File): Promise<{ width: number; height: number } | undefined> {
  if (!file.type.startsWith('image/')) return undefined;

  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => resolve(undefined);
    image.src = URL.createObjectURL(file);
  });
}
