# Image Upload Controller Migration Design

## Background

The first adminApp refactoring batch added the shared API client, TanStack Query, test infrastructure, and architecture boundaries. The second batch migrated `/company` into `features/company-info`, proving the feature/container/view pattern.

The third batch targets `src/admin/components/ImageInput.tsx`. This component is currently a dense mix of:

- file input and DOM refs
- image dimension reading
- optional resizing
- perceptual hash calculation
- media library loading
- duplicate image matching
- upload request orchestration
- reuse/force-upload decision state
- preview rendering
- duplicate dialog rendering
- error and loading UI

This makes the upload workflow hard to test and hard to reuse with another UI. The batch will extract the upload workflow into headless primitives and a controller while keeping existing calling code stable through the old `ImageInput` compatibility wrapper.

## Goals

- Keep every current `ImageInput` call site working without prop changes.
- Move upload preparation and duplicate matching out of the UI component.
- Make the upload flow testable without rendering the full dialog UI.
- Keep current visual behavior stable for existing admin pages.
- Avoid adding new dependencies on `ContentContext` in new shared/media code.
- Provide a reusable upload controller for later media manager and product editor migration.

## Non-Goals

- Do not migrate the full `MediaManager` page in this batch.
- Do not change R2/Worker API contracts.
- Do not redesign the duplicate image dialog.
- Do not modify `src/components/blocks`.
- Do not migrate every media-library behavior such as search, details, usage analysis, delete, or similar-image sidebars.
- Do not delete the old `ImageInput` export yet; it remains as the compatibility entry point.

## Recommended Approach

Split the upload feature into shared media primitives:

```text
src/shared/media/
  api/
    media.api.ts
    media.api.test.ts
  domain/
    findDuplicateImages.ts
    findDuplicateImages.test.ts
    prepareImageUpload.ts
    prepareImageUpload.test.ts
  model/
    useImageUploadController.ts
    useImageUploadController.test.tsx
  ui/
    ImageUploadControl.tsx
    DuplicateImageDialog.tsx
```

Then convert the old component into a wrapper:

```text
src/admin/components/ImageInput.tsx
  -> uses useImageUploadController
  -> renders ImageUploadControl and DuplicateImageDialog
```

The wrapper keeps the current public props:

```ts
interface ImageInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  acceptType?: string;
  maxWidth?: number;
}
```

This keeps the blast radius small. Later batches can migrate `MediaManager`, product media sections, and page-builder image fields to use the controller directly.

## Data Flow

```text
ImageInput wrapper
  -> useImageUploadController
  -> prepareImageUpload
      -> read dimensions
      -> resize when maxWidth applies
      -> calculate image hash
  -> media api
      -> list existing images
      -> upload selected file
  -> findDuplicateImages
  -> ImageUploadControl / DuplicateImageDialog
```

The controller owns workflow decisions:

- no file selected: do nothing
- upload preparation fails: expose an upload error
- duplicates found: pause and expose duplicate candidates
- reuse selected: emit existing image URL
- force upload: upload pending prepared file
- no duplicates: upload immediately

The UI owns only rendering and user actions.

## Domain Contract

`prepareImageUpload(file, options)` returns:

```ts
interface PreparedImageUpload {
  file: File;
  dimensions?: { width: number; height: number };
  hash?: string;
}
```

Rules:

- Non-image files return the original file and no hash.
- Image dimensions are best effort; failure returns `undefined` dimensions.
- Resize runs only when `maxWidth` is provided and the file is an image.
- Hash calculation is best effort; empty hash becomes `undefined`.
- Existing `resizeImage` and `calculateImageHash` behavior should be reused, not rewritten.

`findDuplicateImages(hash, images, threshold)` returns sorted matches:

```ts
interface DuplicateImageMatch {
  image: R2Image;
  similarity: number;
}
```

Rules:

- Missing hash returns an empty list.
- Images without `hash` are ignored.
- Matches use `calculateHashSimilarity`.
- Default threshold is `0.95`.
- Results sort from highest similarity to lowest.

## API Contract

`shared/media/api/media.api.ts` wraps current endpoints:

- `getImagesList()` -> `GET /api/upload/list`
- `uploadImage(file, dimensions, hash)` -> `POST /api/upload` with `FormData`

This API layer may use `apiClient`. UI and controller code must not import the shared API client directly.

The old `ContentContext.uploadImage` and `ContentContext.getImagesList` remain unchanged for unmigrated modules. The new `ImageInput` wrapper should use `shared/media/api` through the controller, not `useContent()`.

## Controller Contract

`useImageUploadController()` should expose:

```ts
interface ImageUploadController {
  isUploading: boolean;
  error: string | null;
  duplicates: DuplicateImageMatch[];
  hasPendingUpload: boolean;
  selectFile: (file: File | null) => Promise<void>;
  reuseImage: (url: string) => void;
  forceUpload: () => Promise<void>;
  clear: () => void;
}
```

Inputs:

```ts
interface UseImageUploadControllerOptions {
  value: string;
  onChange: (value: string) => void;
  maxWidth?: number;
  duplicateThreshold?: number;
}
```

The controller does not render dialogs, buttons, previews, or labels. It also does not read from `ContentContext`.

## UI Contract

`ImageUploadControl` renders the current upload/preview area:

- hidden file input
- upload button when no value exists
- image/video preview when a value exists
- replace and clear buttons
- loading overlay
- inline error

It receives state and callbacks as props. It may continue using `AdminImage`, `getPreviewUrl`, shadcn/ui styling, and existing Tailwind classes.

`DuplicateImageDialog` renders the current duplicate dialog:

- duplicate list
- reuse action
- cancel action
- force upload action

It receives `duplicates`, `isUploading`, and callbacks as props.

## Error Handling

- Upload preparation and upload failures set a stable controller error string.
- Duplicate reuse clears pending state and error.
- Cancel clears duplicate candidates and pending upload.
- Force upload failures keep the error visible and clear pending state only when the flow is finished.

The exact user-facing Chinese copy may stay close to the current component to avoid visual/content churn.

## Cache And Server State

This batch does not introduce a full media-library query cache. The upload controller can call `getImagesList()` imperatively because the existing upload flow is local to a single file selection.

Later `features/media` migration may introduce `mediaKeys.list(filters)` and full media-library Query/Mutation behavior. That is intentionally out of scope here.

## Compatibility

The old `ImageInput` default export remains at:

```text
src/admin/components/ImageInput.tsx
```

All existing call sites keep working. The wrapper delegates to the new controller and UI components.

This means migrated and unmigrated pages can continue consuming `ImageInput` while the upload workflow becomes testable and replaceable.

## Testing

The batch should add focused tests:

- `findDuplicateImages` filters by hash, threshold, and descending similarity.
- `prepareImageUpload` delegates resizing/hash/dimension behavior with injected helpers where practical.
- `media.api` preserves current upload/list endpoint contracts.
- `useImageUploadController` covers direct upload, duplicate pause, reuse existing image, force upload, and upload error behavior.
- `ImageInput` compatibility wrapper triggers the controller and preserves the public prop contract at a smoke-test level.

Full visual snapshot tests are intentionally avoided.

## Acceptance Criteria

- Existing `ImageInput` consumers require no prop changes.
- New shared media model/domain code has tests.
- New shared media UI does not import `ContentContext`, `@/lib/api`, or `@/shared/api/client`.
- Only `shared/media/api` imports `apiClient`.
- The duplicate image behavior still supports reuse and force upload.
- `src/components/blocks` is unchanged.
- Existing app tests pass.
- Production build passes.
- Existing lint baseline is not worsened.
