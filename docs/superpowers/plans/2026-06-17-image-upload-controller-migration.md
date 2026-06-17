# Image Upload Controller Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the current `ImageInput` upload and duplicate-detection workflow into testable `shared/media` domain, API, controller, and UI modules while preserving the existing `ImageInput` public props.

**Architecture:** `shared/media/domain` owns pure upload-preparation and duplicate-matching logic. `shared/media/api` is the only new media layer that imports `apiClient`; `shared/media/model` orchestrates the workflow without `ContentContext`; `shared/media/ui` renders the current upload and duplicate-dialog UI. `src/admin/components/ImageInput.tsx` remains the compatibility wrapper for existing callers.

**Tech Stack:** React 19, TypeScript, Vite 7, Vitest, Testing Library, shared API client, existing image helpers in `src/lib/image.ts`, shadcn/ui.

---

## File Structure

### Create

```text
src/shared/media/domain/findDuplicateImages.ts
src/shared/media/domain/findDuplicateImages.test.ts
src/shared/media/domain/prepareImageUpload.ts
src/shared/media/domain/prepareImageUpload.test.ts
src/shared/media/api/media.api.ts
src/shared/media/api/media.api.test.ts
src/shared/media/model/useImageUploadController.ts
src/shared/media/model/useImageUploadController.test.tsx
src/shared/media/ui/ImageUploadControl.tsx
src/shared/media/ui/DuplicateImageDialog.tsx
src/admin/components/ImageInput.test.tsx
```

### Modify

```text
src/admin/components/ImageInput.tsx
docs/README.md
```

### Do Not Modify

```text
src/components/blocks/**
src/context/ContentContext.tsx
src/admin/MediaManager.tsx
src/admin/media/**
```

`MediaManager` continues using the legacy `ContentContext` media functions until a later `features/media` migration.

---

## Task 1: Add Duplicate Matching Domain Function

**Files:**
- Create: `src/shared/media/domain/findDuplicateImages.ts`
- Test: `src/shared/media/domain/findDuplicateImages.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/shared/media/domain/findDuplicateImages.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { R2Image } from '@/types';
import { findDuplicateImages } from './findDuplicateImages';

function image(key: string, hash?: string): R2Image {
  return {
    key,
    name: `${key}.jpg`,
    url: `/${key}.jpg`,
    thumbUrl: `/${key}-thumb.jpg`,
    size: 100,
    hash,
    uploaded: '2026-06-16T00:00:00.000Z',
  };
}

describe('findDuplicateImages', () => {
  it('returns matches at or above the threshold sorted by similarity', () => {
    const hash = '1'.repeat(64);
    const oneBitDifferent = `${'1'.repeat(63)}0`;
    const twoBitsDifferent = `${'1'.repeat(62)}00`;
    const farDifferent = '0'.repeat(64);

    const matches = findDuplicateImages(hash, [
      image('no-hash'),
      image('far', farDifferent),
      image('two-bit', twoBitsDifferent),
      image('exact', hash),
      image('one-bit', oneBitDifferent),
    ], 0.95);

    expect(matches.map((match) => match.image.key)).toEqual(['exact', 'one-bit', 'two-bit']);
    expect(matches.map((match) => match.similarity)).toEqual([1, 63 / 64, 62 / 64]);
  });

  it('returns an empty list when the selected hash is missing', () => {
    expect(findDuplicateImages('', [image('exact', '1'.repeat(64))])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/media/domain/findDuplicateImages.test.ts
```

Expected: FAIL because `./findDuplicateImages` does not exist.

- [ ] **Step 3: Implement the function**

Create `src/shared/media/domain/findDuplicateImages.ts`:

```ts
import type { R2Image } from '@/types';
import { calculateHashSimilarity } from '@/lib/image';

export interface DuplicateImageMatch {
  image: R2Image;
  similarity: number;
}

export function findDuplicateImages(
  hash: string | undefined,
  images: R2Image[],
  threshold = 0.95,
): DuplicateImageMatch[] {
  if (!hash) {
    return [];
  }

  return images
    .map((image) => ({
      image,
      similarity: image.hash ? calculateHashSimilarity(hash, image.hash) : 0,
    }))
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/shared/media/domain/findDuplicateImages.test.ts
```

Expected: `2 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/shared/media/domain/findDuplicateImages.ts src/shared/media/domain/findDuplicateImages.test.ts
git commit -m "feat: add media duplicate matching"
```

---

## Task 2: Add Upload Preparation Domain Function

**Files:**
- Create: `src/shared/media/domain/prepareImageUpload.ts`
- Test: `src/shared/media/domain/prepareImageUpload.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/shared/media/domain/prepareImageUpload.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { prepareImageUpload } from './prepareImageUpload';

describe('prepareImageUpload', () => {
  it('returns non-image files unchanged without dimensions or hash', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });

    await expect(prepareImageUpload(file)).resolves.toEqual({ file });
  });

  it('resizes image files and normalizes empty hashes to undefined', async () => {
    const original = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const resized = new File(['resized'], 'image.jpg', { type: 'image/jpeg' });
    const readDimensions = vi.fn().mockResolvedValue({ width: 1200, height: 800 });
    const resize = vi.fn().mockResolvedValue(resized);
    const calculateHash = vi.fn().mockResolvedValue('');

    const prepared = await prepareImageUpload(original, {
      maxWidth: 400,
      readDimensions,
      resize,
      calculateHash,
    });

    expect(readDimensions).toHaveBeenCalledWith(original);
    expect(resize).toHaveBeenCalledWith(original, 400);
    expect(calculateHash).toHaveBeenCalledWith(resized);
    expect(prepared).toEqual({
      file: resized,
      dimensions: { width: 1200, height: 800 },
      hash: undefined,
    });
  });

  it('keeps the original image file when maxWidth is omitted', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const resize = vi.fn();
    const calculateHash = vi.fn().mockResolvedValue('1'.repeat(64));

    const prepared = await prepareImageUpload(file, {
      resize,
      calculateHash,
      readDimensions: vi.fn().mockResolvedValue(undefined),
    });

    expect(resize).not.toHaveBeenCalled();
    expect(prepared.file).toBe(file);
    expect(prepared.hash).toBe('1'.repeat(64));
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/media/domain/prepareImageUpload.test.ts
```

Expected: FAIL because `./prepareImageUpload` does not exist.

- [ ] **Step 3: Implement the function**

Create `src/shared/media/domain/prepareImageUpload.ts`:

```ts
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
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/shared/media/domain/prepareImageUpload.test.ts
```

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/shared/media/domain/prepareImageUpload.ts src/shared/media/domain/prepareImageUpload.test.ts
git commit -m "feat: add media upload preparation"
```

---

## Task 3: Add Shared Media API

**Files:**
- Create: `src/shared/media/api/media.api.ts`
- Test: `src/shared/media/api/media.api.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/shared/media/api/media.api.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { getImagesList, uploadImage } from './media.api';

describe('shared media api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads the existing upload list endpoint', async () => {
    requestMock.mockResolvedValueOnce([]);

    await expect(getImagesList()).resolves.toEqual([]);

    expect(requestMock).toHaveBeenCalledWith('/api/upload/list');
  });

  it('uploads files with dimensions and hash through FormData', async () => {
    requestMock.mockResolvedValueOnce({
      url: '/image.jpg',
      thumbUrl: '/image-thumb.jpg',
      key: 'image.jpg',
    });
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    await uploadImage(file, { width: 100, height: 80 }, 'hash-value');

    const [path, options] = requestMock.mock.calls[0] as [string, RequestInit];
    const body = options.body as FormData;

    expect(path).toBe('/api/upload');
    expect(options.method).toBe('POST');
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('file')).toBe(file);
    expect(body.get('width')).toBe('100');
    expect(body.get('height')).toBe('80');
    expect(body.get('hash')).toBe('hash-value');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/media/api/media.api.test.ts
```

Expected: FAIL because `./media.api` does not exist.

- [ ] **Step 3: Implement the API**

Create `src/shared/media/api/media.api.ts`:

```ts
import { apiClient } from '@/shared/api/client';
import type { R2Image } from '@/types';

export interface UploadedImage {
  url: string;
  thumbUrl: string;
  key: string;
}

export function getImagesList(): Promise<R2Image[]> {
  return apiClient.request<R2Image[]>('/api/upload/list');
}

export function uploadImage(
  file: File,
  dimensions?: { width: number; height: number },
  hash?: string,
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', file);

  if (dimensions) {
    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());
  }
  if (hash) {
    formData.append('hash', hash);
  }

  return apiClient.request<UploadedImage>('/api/upload', {
    method: 'POST',
    body: formData,
  });
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/shared/media/api/media.api.test.ts
```

Expected: `2 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/shared/media/api
git commit -m "feat: add shared media api"
```

---

## Task 4: Add Image Upload Controller

**Files:**
- Create: `src/shared/media/model/useImageUploadController.ts`
- Test: `src/shared/media/model/useImageUploadController.test.tsx`

- [ ] **Step 1: Write the failing controller test**

Create `src/shared/media/model/useImageUploadController.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { R2Image } from '@/types';

const { prepareImageUploadMock, getImagesListMock, uploadImageMock } = vi.hoisted(() => ({
  prepareImageUploadMock: vi.fn(),
  getImagesListMock: vi.fn(),
  uploadImageMock: vi.fn(),
}));

vi.mock('../domain/prepareImageUpload', () => ({
  prepareImageUpload: prepareImageUploadMock,
}));

vi.mock('../api/media.api', () => ({
  getImagesList: getImagesListMock,
  uploadImage: uploadImageMock,
}));

import { useImageUploadController } from './useImageUploadController';

function r2Image(hash: string): R2Image {
  return {
    key: 'existing.jpg',
    name: 'existing.jpg',
    url: '/existing.jpg',
    thumbUrl: '/existing-thumb.jpg',
    size: 100,
    hash,
    uploaded: '2026-06-16T00:00:00.000Z',
  };
}

describe('useImageUploadController', () => {
  beforeEach(() => {
    prepareImageUploadMock.mockReset();
    getImagesListMock.mockReset();
    uploadImageMock.mockReset();
  });

  it('uploads immediately when no duplicate image is found', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    prepareImageUploadMock.mockResolvedValueOnce({
      file,
      dimensions: { width: 100, height: 80 },
      hash: '1'.repeat(64),
    });
    getImagesListMock.mockResolvedValueOnce([]);
    uploadImageMock.mockResolvedValueOnce({ url: '/new.jpg' });

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(uploadImageMock).toHaveBeenCalledWith(file, { width: 100, height: 80 }, '1'.repeat(64));
    expect(onChange).toHaveBeenCalledWith('/new.jpg');
    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('pauses when duplicates are found, then reuses an existing image', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const hash = '1'.repeat(64);
    prepareImageUploadMock.mockResolvedValueOnce({ file, hash });
    getImagesListMock.mockResolvedValueOnce([r2Image(hash)]);

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(result.current.duplicates).toHaveLength(1);
    expect(result.current.hasPendingUpload).toBe(true);
    expect(uploadImageMock).not.toHaveBeenCalled();

    act(() => {
      result.current.reuseImage('/existing.jpg');
    });

    expect(onChange).toHaveBeenCalledWith('/existing.jpg');
    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('can force upload a pending duplicate candidate', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const hash = '1'.repeat(64);
    prepareImageUploadMock.mockResolvedValueOnce({ file, hash });
    getImagesListMock.mockResolvedValueOnce([r2Image(hash)]);
    uploadImageMock.mockResolvedValueOnce({ url: '/forced.jpg' });

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });
    await act(async () => {
      await result.current.forceUpload();
    });

    expect(uploadImageMock).toHaveBeenCalledWith(file, undefined, hash);
    expect(onChange).toHaveBeenCalledWith('/forced.jpg');
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('exposes an error when upload preparation fails', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    prepareImageUploadMock.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange: vi.fn() }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(result.current.error).toBe('图片上传失败，请重试');
    expect(result.current.isUploading).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/media/model/useImageUploadController.test.tsx
```

Expected: FAIL because `./useImageUploadController` does not exist.

- [ ] **Step 3: Implement the controller**

Create `src/shared/media/model/useImageUploadController.ts`:

```ts
import { useState } from 'react';
import { getImagesList, uploadImage } from '../api/media.api';
import { findDuplicateImages, type DuplicateImageMatch } from '../domain/findDuplicateImages';
import { prepareImageUpload, type PreparedImageUpload } from '../domain/prepareImageUpload';

interface UseImageUploadControllerOptions {
  value: string;
  onChange: (value: string) => void;
  maxWidth?: number;
  duplicateThreshold?: number;
}

export function useImageUploadController({
  onChange,
  maxWidth,
  duplicateThreshold = 0.95,
}: UseImageUploadControllerOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateImageMatch[]>([]);
  const [pendingUpload, setPendingUpload] = useState<PreparedImageUpload | null>(null);

  function clear() {
    setDuplicates([]);
    setPendingUpload(null);
    setError(null);
  }

  async function uploadPrepared(prepared: PreparedImageUpload) {
    const result = await uploadImage(prepared.file, prepared.dimensions, prepared.hash);
    onChange(result.url);
  }

  async function selectFile(file: File | null) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const prepared = await prepareImageUpload(file, { maxWidth });
      const images = prepared.hash ? await getImagesList() : [];
      const matches = findDuplicateImages(prepared.hash, images, duplicateThreshold);

      if (matches.length > 0) {
        setDuplicates(matches);
        setPendingUpload(prepared);
        return;
      }

      await uploadPrepared(prepared);
      clear();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  }

  function reuseImage(url: string) {
    onChange(url);
    clear();
  }

  async function forceUpload() {
    if (!pendingUpload) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await uploadPrepared(pendingUpload);
      clear();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('上传失败');
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isUploading,
    error,
    duplicates,
    hasPendingUpload: pendingUpload !== null,
    selectFile,
    reuseImage,
    forceUpload,
    clear,
  };
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/shared/media/model/useImageUploadController.test.tsx
```

Expected: `4 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/shared/media/model
git commit -m "feat: add image upload controller"
```

---

## Task 5: Extract Upload UI Components And Wrap Legacy ImageInput

**Files:**
- Create: `src/shared/media/ui/ImageUploadControl.tsx`
- Create: `src/shared/media/ui/DuplicateImageDialog.tsx`
- Modify: `src/admin/components/ImageInput.tsx`
- Test: `src/admin/components/ImageInput.test.tsx`

- [ ] **Step 1: Write the failing compatibility test**

Create `src/admin/components/ImageInput.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { controllerMock } = vi.hoisted(() => ({
  controllerMock: {
    isUploading: false,
    error: null,
    duplicates: [],
    hasPendingUpload: false,
    selectFile: vi.fn(),
    reuseImage: vi.fn(),
    forceUpload: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock('@/shared/media/model/useImageUploadController', () => ({
  useImageUploadController: vi.fn(() => controllerMock),
}));

vi.mock('@/admin/components/AdminImage', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import ImageInput from './ImageInput';

describe('ImageInput compatibility wrapper', () => {
  beforeEach(() => {
    controllerMock.selectFile.mockReset();
    controllerMock.reuseImage.mockReset();
    controllerMock.forceUpload.mockReset();
    controllerMock.clear.mockReset();
    controllerMock.error = null;
    controllerMock.duplicates = [];
    controllerMock.isUploading = false;
  });

  it('keeps the existing props and delegates file selection to the controller', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    render(
      <ImageInput
        label="上传图片"
        value=""
        onChange={() => undefined}
        aspectRatio="square"
        acceptType="image/*"
        maxWidth={400}
      />,
    );

    await user.upload(screen.getByLabelText('上传图片'), file);

    expect(controllerMock.selectFile).toHaveBeenCalledWith(file);
  });

  it('renders controller errors', () => {
    controllerMock.error = '图片上传失败，请重试';

    render(<ImageInput value="" onChange={() => undefined} />);

    expect(screen.getByText('图片上传失败，请重试')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm.cmd test -- src/admin/components/ImageInput.test.tsx
```

Expected: FAIL because `ImageInput` still uses `ContentContext` and does not render an accessible label/input contract for the test.

- [ ] **Step 3: Create `ImageUploadControl`**

Create `src/shared/media/ui/ImageUploadControl.tsx` by moving the upload/preview JSX from the current `ImageInput` into a presentational component. Use this exact prop contract:

```tsx
import { useRef } from 'react';
import { Loader2, RefreshCw, Upload, X } from 'lucide-react';
import AdminImage from '@/admin/components/AdminImage';
import { getPreviewUrl } from '@/lib/utils';

interface ImageUploadControlProps {
  label?: string;
  value: string;
  error: string | null;
  isUploading: boolean;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  acceptType?: string;
  onSelectFile: (file: File | null) => void;
  onClearImage: () => void;
}

export function ImageUploadControl({
  label,
  value,
  error,
  isUploading,
  aspectRatio = 'auto',
  className = '',
  acceptType = 'image/*',
  onSelectFile,
  onClearImage,
}: ImageUploadControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = label ? `image-input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  const aspectRatioClass = {
    square: 'aspect-square max-w-[140px]',
    video: 'aspect-video max-w-[220px]',
    banner: 'aspect-[3/1] max-w-[320px]',
    auto: 'min-h-[80px] h-24 max-w-[160px]',
  }[aspectRatio];

  const previewUrl = getPreviewUrl(value, true);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    onSelectFile(event.target.files?.[0] ?? null);
  }

  function clearImage() {
    onClearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptType}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      {!value ? (
        <button
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectRatioClass} border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">本地上传</span>
            </>
          )}
        </button>
      ) : (
        <div className={`relative w-full ${aspectRatioClass} bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group`}>
          {previewUrl && (previewUrl.match(/\.(mp4|webm|ogg)$/i) || acceptType.includes('video')) ? (
            <video src={previewUrl} className="w-full h-full object-contain bg-black" />
          ) : (
            <AdminImage
              src={value}
              thumbnail={true}
              fallbackSrc={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="更换图片"
              >
                <RefreshCw className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                title="删除图片"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `DuplicateImageDialog`**

Create `src/shared/media/ui/DuplicateImageDialog.tsx` by moving the duplicate-dialog JSX from the current `ImageInput` into a presentational component. Use this prop contract:

```tsx
import AdminImage from '@/admin/components/AdminImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DuplicateImageMatch } from '../domain/findDuplicateImages';

interface DuplicateImageDialogProps {
  duplicates: DuplicateImageMatch[];
  isUploading: boolean;
  onReuse: (url: string) => void;
  onForceUpload: () => void;
  onCancel: () => void;
}

export function DuplicateImageDialog({
  duplicates,
  isUploading,
  onReuse,
  onForceUpload,
  onCancel,
}: DuplicateImageDialogProps) {
  return (
    <Dialog open={duplicates.length > 0} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            检测到相似图片
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            系统检测到图库中已有与当前上传内容高度相似的图片，建议直接复用以节约存储空间。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-60 mt-3 border rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100 bg-gray-50/50">
            {duplicates.map(({ image, similarity }) => (
              <div key={image.key} className="flex items-center gap-3 p-3 bg-white">
                <div className="w-12 h-12 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  <AdminImage
                    src={image.thumbUrl || image.url}
                    fallbackSrc={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {image.dimensions || '未知尺寸'} · 相似度{' '}
                    <span className="font-bold text-orange-600">
                      {(similarity * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium text-primary hover:text-primary-hover hover:bg-primary/5 h-8 shrink-0"
                  onClick={() => onReuse(image.url)}
                >
                  复用此图
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-3 border-t flex gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs text-gray-500">
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onForceUpload}
            className="text-xs"
            disabled={isUploading}
          >
            坚持上传新图
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 5: Replace `ImageInput` with wrapper**

Replace `src/admin/components/ImageInput.tsx` with:

```tsx
import { useImageUploadController } from '@/shared/media/model/useImageUploadController';
import { DuplicateImageDialog } from '@/shared/media/ui/DuplicateImageDialog';
import { ImageUploadControl } from '@/shared/media/ui/ImageUploadControl';

interface ImageInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  acceptType?: string;
  maxWidth?: number;
}

export default function ImageInput({
  label,
  value,
  onChange,
  aspectRatio = 'auto',
  className = '',
  acceptType = 'image/*',
  maxWidth,
}: ImageInputProps) {
  const controller = useImageUploadController({
    value,
    onChange,
    maxWidth,
  });

  function clearImage() {
    onChange('');
    controller.clear();
  }

  return (
    <>
      <ImageUploadControl
        label={label}
        value={value}
        error={controller.error}
        isUploading={controller.isUploading}
        aspectRatio={aspectRatio}
        className={className}
        acceptType={acceptType}
        onSelectFile={controller.selectFile}
        onClearImage={clearImage}
      />
      <DuplicateImageDialog
        duplicates={controller.duplicates}
        isUploading={controller.isUploading}
        onReuse={controller.reuseImage}
        onForceUpload={controller.forceUpload}
        onCancel={controller.clear}
      />
    </>
  );
}
```

- [ ] **Step 6: Run compatibility test**

Run:

```powershell
npm.cmd test -- src/admin/components/ImageInput.test.tsx
```

Expected: compatibility tests pass.

- [ ] **Step 7: Run targeted media tests**

Run:

```powershell
npm.cmd test -- src/shared/media src/admin/components/ImageInput.test.tsx
```

Expected: all media and wrapper tests pass.

- [ ] **Step 8: Commit**

```powershell
git add src/shared/media/ui src/admin/components/ImageInput.tsx src/admin/components/ImageInput.test.tsx
git commit -m "refactor: wrap image input with upload controller"
```

---

## Task 6: Documentation And Final Verification

**Files:**
- Modify: `docs/README.md`

- [ ] **Step 1: Update project navigation**

Modify `docs/README.md` to mention:

```text
shared/
├── api/                         API client、环境配置与统一错误模型
└── media/                       图片上传准备、查重、上传 controller 与兼容 UI
```

Also add a short note near the progressive refactoring constraints:

```markdown
`ImageInput` 保留旧导出，但上传准备、查重和上传编排已迁入 `shared/media`；后续媒体管理页再独立迁移到 `features/media`。
```

- [ ] **Step 2: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/shared/media src/admin/components/ImageInput.test.tsx
```

Expected: targeted media tests pass.

- [ ] **Step 3: Run full tests**

Run:

```powershell
npm.cmd test
```

Expected: all tests pass.

- [ ] **Step 4: Run production build**

Run:

```powershell
npm.cmd run build
```

Expected: build passes. Existing Vite chunk-size warning is acceptable.

- [ ] **Step 5: Run lint and compare baseline**

Run:

```powershell
npm.cmd run lint
```

Expected: the repository may still report the existing baseline of `87 problems (82 errors, 5 warnings)`. New files under `src/shared/media` and `src/admin/components/ImageInput.test.tsx` must not add lint errors.

Also run:

```powershell
npx.cmd eslint src/shared/media src/admin/components/ImageInput.tsx src/admin/components/ImageInput.test.tsx
```

Expected: no lint errors in new/modified media files.

- [ ] **Step 6: Confirm excluded scopes were not modified**

Run:

```powershell
git diff --name-only dbb1c2f..HEAD -- src/components/blocks
git diff --name-only dbb1c2f..HEAD -- src/context/ContentContext.tsx
git diff --name-only dbb1c2f..HEAD -- src/admin/MediaManager.tsx src/admin/media
```

Expected: no output for all commands.

- [ ] **Step 7: Confirm architecture boundaries**

Run:

```powershell
rg "@/context/ContentContext|@/lib/api|@/shared/api/client" src/shared/media
rg "@/shared/api/client" src/shared/media
```

Expected:

- First command only reports `src/shared/media/api/media.api.ts` for `@/shared/api/client`, and no `ContentContext` or `@/lib/api`.
- Second command reports only `src/shared/media/api/media.api.ts`.

- [ ] **Step 8: Commit docs**

```powershell
git add docs/README.md
git commit -m "docs: document shared media upload architecture"
```

- [ ] **Step 9: Final status check**

Run:

```powershell
git status --short
git log --oneline -8
```

Expected: working tree is clean except for any pre-existing untracked `.codegraph/`. Recent commits cover duplicate matching, upload preparation, media API, upload controller, ImageInput wrapper/UI, and docs.

---

## Completion Criteria

- Existing `ImageInput` call sites compile without prop changes.
- `ImageInput` no longer imports `ContentContext`, `@/lib/api`, `resizeImage`, `calculateImageHash`, or `calculateHashSimilarity` directly.
- `shared/media/domain` and `shared/media/model` have focused tests.
- `shared/media/api/media.api.ts` is the only new shared media file importing `apiClient`.
- Duplicate detection still supports reuse and force-upload paths.
- `src/components/blocks`, `ContentContext`, `MediaManager`, and `src/admin/media` are unchanged.
- Targeted tests, full tests, and production build pass.
- Existing lint baseline is not worsened.
