import { calculateImageHash, resizeImage } from '@/lib/image';

export interface PreparedImageUpload {
  file: File;
  dimensions?: { width: number; height: number };
  hash?: string;
}

interface PrepareImageUploadDependencies {
  readDimensions?: (file: File) => Promise<{ width: number; height: number } | undefined>;
  resize?: (file: File, maxWidth: number) => Promise<File>;
  calculateHash?: (file: File) => Promise<string>;
}

export interface PrepareImageUploadOptions extends PrepareImageUploadDependencies {
  maxWidth?: number;
}

async function defaultReadDimensions(file: File): Promise<{ width: number; height: number } | undefined> {
  if (!file.type.startsWith('image/')) {
    return undefined;
  }

  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    image.src = url;
  });
}

export async function prepareImageUpload(
  file: File,
  {
    maxWidth,
    readDimensions = defaultReadDimensions,
    resize = resizeImage,
    calculateHash = calculateImageHash,
  }: PrepareImageUploadOptions = {},
): Promise<PreparedImageUpload> {
  if (!file.type.startsWith('image/')) {
    return { file };
  }

  const dimensions = await readDimensions(file);
  const fileToUpload = maxWidth ? await resize(file, maxWidth) : file;
  const hash = await calculateHash(fileToUpload);

  return {
    file: fileToUpload,
    dimensions,
    hash: hash || undefined,
  };
}
