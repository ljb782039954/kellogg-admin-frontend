# Company Info Feature Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the company information editor from the legacy `ContentContext` page into a `features/company-info` module with domain API, mapper/schema, React Hook Form controller, replaceable view, and focused tests.

**Architecture:** The `/company` route will import from `@/features/company-info`. The feature API layer talks to the shared API client; the model layer owns defaults, schema, and mapper normalization; the UI layer consumes a form/controller contract and must not import `ContentContext`, `@/lib/api`, or `@/shared/api/client`. Legacy `ContentContext` remains for other modules.

**Tech Stack:** React 19, TypeScript, Vite 7, TanStack Query, React Hook Form, Zod, Vitest, Testing Library, MSW, ESLint.

---

## File Structure

### Create

```text
src/shared/forms/controls/BilingualTextControl.tsx
src/shared/forms/controls/BilingualTextControl.test.tsx
src/shared/forms/controls/BilingualTextareaControl.tsx
src/shared/forms/controls/BilingualTextareaControl.test.tsx
src/features/company-info/api/companyInfo.keys.ts
src/features/company-info/api/companyInfo.api.ts
src/features/company-info/api/companyInfo.api.test.ts
src/features/company-info/model/companyInfo.defaults.ts
src/features/company-info/model/companyInfo.schema.ts
src/features/company-info/model/companyInfo.mapper.ts
src/features/company-info/model/companyInfo.mapper.test.ts
src/features/company-info/model/useCompanyInfoForm.ts
src/features/company-info/model/useCompanyInfoForm.test.tsx
src/features/company-info/ui/CompanyInfoFormView.tsx
src/features/company-info/ui/CompanyInfoEditor.tsx
src/features/company-info/ui/CompanyInfoEditor.test.tsx
src/features/company-info/index.ts
```

### Modify

```text
src/App.tsx
docs/README.md
```

### Do Not Modify

```text
src/components/blocks/**
src/context/ContentContext.tsx
src/admin/editors/CompanyInfoEditor.tsx
```

The old company editor stays in the tree during migration. It is only removed from the active route import.

---

## Task 1: Add Shared Bilingual Controls

**Files:**
- Create: `src/shared/forms/controls/BilingualTextControl.tsx`
- Create: `src/shared/forms/controls/BilingualTextControl.test.tsx`
- Create: `src/shared/forms/controls/BilingualTextareaControl.tsx`
- Create: `src/shared/forms/controls/BilingualTextareaControl.test.tsx`

- [ ] **Step 1: Write failing tests for `BilingualTextControl`**

Create `src/shared/forms/controls/BilingualTextControl.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BilingualTextControl } from './BilingualTextControl';

describe('BilingualTextControl', () => {
  it('renders zh and en values and emits merged translation changes', () => {
    const onChange = vi.fn();

    render(
      <BilingualTextControl
        value={{ zh: '品牌', en: 'Brand' }}
        onChange={onChange}
        placeholder={{ zh: '中文名称', en: 'English name' }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('中文名称'), {
      target: { value: '新品牌' },
    });

    expect(screen.getByPlaceholderText('English name')).toHaveValue('Brand');
    expect(onChange).toHaveBeenLastCalledWith({ zh: '新品牌', en: 'Brand' });
  });

  it('supports row layout for compact form sections', () => {
    const { container } = render(
      <BilingualTextControl
        value={{ zh: '', en: '' }}
        onChange={() => undefined}
        layout="row"
      />,
    );

    expect(container.querySelector('.flex-row')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the text control test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/forms/controls/BilingualTextControl.test.tsx
```

Expected: FAIL because `./BilingualTextControl` does not exist.

- [ ] **Step 3: Implement `BilingualTextControl`**

Create `src/shared/forms/controls/BilingualTextControl.tsx`:

```tsx
import type { Translation } from '@/types';

interface BilingualTextControlProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  layout?: 'col' | 'row';
  disabled?: boolean;
}

export function BilingualTextControl({
  label,
  value,
  onChange,
  placeholder = {},
  layout = 'col',
  disabled = false,
}: BilingualTextControlProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className={`flex ${layout === 'col' ? 'flex-col' : 'flex-row'} gap-3`}>
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            中文
          </span>
          <input
            type="text"
            value={value.zh || ''}
            onChange={(event) => onChange({ ...value, zh: event.target.value })}
            placeholder={placeholder.zh}
            disabled={disabled}
            className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            EN
          </span>
          <input
            type="text"
            value={value.en || ''}
            onChange={(event) => onChange({ ...value, en: event.target.value })}
            placeholder={placeholder.en}
            disabled={disabled}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write failing tests for `BilingualTextareaControl`**

Create `src/shared/forms/controls/BilingualTextareaControl.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BilingualTextareaControl } from './BilingualTextareaControl';

describe('BilingualTextareaControl', () => {
  it('renders textarea values and emits merged translation changes', () => {
    const onChange = vi.fn();

    render(
      <BilingualTextareaControl
        value={{ zh: '介绍', en: 'Intro' }}
        onChange={onChange}
        placeholder={{ zh: '中文介绍', en: 'English intro' }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('English intro'), {
      target: { value: 'New intro' },
    });

    expect(screen.getByPlaceholderText('中文介绍')).toHaveValue('介绍');
    expect(onChange).toHaveBeenLastCalledWith({ zh: '介绍', en: 'New intro' });
  });
});
```

- [ ] **Step 5: Run the textarea control test and verify RED**

Run:

```powershell
npm.cmd test -- src/shared/forms/controls/BilingualTextareaControl.test.tsx
```

Expected: FAIL because `./BilingualTextareaControl` does not exist.

- [ ] **Step 6: Implement `BilingualTextareaControl`**

Create `src/shared/forms/controls/BilingualTextareaControl.tsx`:

```tsx
import type { Translation } from '@/types';

interface BilingualTextareaControlProps {
  label?: string;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
  disabled?: boolean;
  rows?: number;
}

export function BilingualTextareaControl({
  label,
  value,
  onChange,
  placeholder = {},
  disabled = false,
  rows = 3,
}: BilingualTextareaControlProps) {
  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            中文
          </span>
          <textarea
            value={value.zh || ''}
            onChange={(event) => onChange({ ...value, zh: event.target.value })}
            placeholder={placeholder.zh}
            disabled={disabled}
            rows={rows}
            className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            EN
          </span>
          <textarea
            value={value.en || ''}
            onChange={(event) => onChange({ ...value, en: event.target.value })}
            placeholder={placeholder.en}
            disabled={disabled}
            rows={rows}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Run shared control tests**

Run:

```powershell
npm.cmd test -- src/shared/forms/controls/BilingualTextControl.test.tsx src/shared/forms/controls/BilingualTextareaControl.test.tsx
```

Expected: all shared control tests pass.

- [ ] **Step 8: Commit shared controls**

```powershell
git add src/shared/forms/controls
git commit -m "feat: add shared bilingual form controls"
```

---

## Task 2: Add Company Info Model Defaults, Schema, And Mapper

**Files:**
- Create: `src/features/company-info/model/companyInfo.defaults.ts`
- Create: `src/features/company-info/model/companyInfo.schema.ts`
- Create: `src/features/company-info/model/companyInfo.mapper.ts`
- Create: `src/features/company-info/model/companyInfo.mapper.test.ts`

- [ ] **Step 1: Write failing mapper/default tests**

Create `src/features/company-info/model/companyInfo.mapper.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { blankCompanyInfo } from './companyInfo.defaults';
import {
  companyInfoSchema,
  toCompanyInfoFormValues,
  toCompanyInfoPayload,
} from './companyInfo.mapper';

describe('company info mapper', () => {
  it('fills missing nested values with defaults', () => {
    const form = toCompanyInfoFormValues({
      name: { zh: '杭州品牌', en: 'Hangzhou Brand' },
      socialMedia: { instagram: 'https://instagram.example' },
    });

    expect(form).toEqual({
      ...blankCompanyInfo,
      name: { zh: '杭州品牌', en: 'Hangzhou Brand' },
      socialMedia: { instagram: 'https://instagram.example' },
    });
  });

  it('normalizes blank optional social links to undefined in payloads', () => {
    const payload = toCompanyInfoPayload({
      ...blankCompanyInfo,
      socialMedia: {
        instagram: '  https://instagram.example  ',
        twitter: '   ',
        youtube: '',
      },
    });

    expect(payload.socialMedia).toEqual({
      instagram: 'https://instagram.example',
      twitter: undefined,
      youtube: undefined,
    });
  });

  it('validates the complete nested company info shape', () => {
    const parsed = companyInfoSchema.parse(blankCompanyInfo);

    expect(parsed).toEqual(blankCompanyInfo);
  });
});
```

- [ ] **Step 2: Run mapper test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/company-info/model/companyInfo.mapper.test.ts
```

Expected: FAIL because the model files do not exist.

- [ ] **Step 3: Implement defaults**

Create `src/features/company-info/model/companyInfo.defaults.ts`:

```ts
import type { CompanyInfo } from '@/types';

export const blankCompanyInfo: CompanyInfo = {
  name: { zh: '', en: '' },
  logo: '',
  description: { zh: '', en: '' },
  contact: {
    phone: '',
    email: '',
    address: { zh: '', en: '' },
  },
  socialMedia: {},
};
```

- [ ] **Step 4: Implement schema**

Create `src/features/company-info/model/companyInfo.schema.ts`:

```ts
import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string().default(''),
  en: z.string().default(''),
});

export const companyInfoSchema = z.object({
  name: translationSchema,
  logo: z.string().default(''),
  description: translationSchema,
  contact: z.object({
    phone: z.string().default(''),
    email: z.string().default(''),
    address: translationSchema,
  }),
  socialMedia: z.object({
    wechat: z.string().optional(),
    weibo: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
    whatsapp: z.string().optional(),
  }).default({}),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
```

- [ ] **Step 5: Implement mapper**

Create `src/features/company-info/model/companyInfo.mapper.ts`:

```ts
import type { CompanyInfo } from '@/types';
import { blankCompanyInfo } from './companyInfo.defaults';
import { companyInfoSchema, type CompanyInfoFormValues } from './companyInfo.schema';

const socialKeys = [
  'wechat',
  'weibo',
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'linkedin',
  'tiktok',
  'whatsapp',
] as const;

type SocialKey = (typeof socialKeys)[number];

function normalizeSocialMedia(
  socialMedia: CompanyInfoFormValues['socialMedia'],
): CompanyInfo['socialMedia'] {
  return socialKeys.reduce<CompanyInfo['socialMedia']>((result, key) => {
    const value = socialMedia[key as SocialKey]?.trim();
    if (value) {
      result[key] = value;
    } else if (key in socialMedia) {
      result[key] = undefined;
    }
    return result;
  }, {});
}

export { companyInfoSchema };
export type { CompanyInfoFormValues };

export function toCompanyInfoFormValues(input: Partial<CompanyInfo> | null | undefined): CompanyInfoFormValues {
  return companyInfoSchema.parse({
    ...blankCompanyInfo,
    ...input,
    name: { ...blankCompanyInfo.name, ...input?.name },
    description: { ...blankCompanyInfo.description, ...input?.description },
    contact: {
      ...blankCompanyInfo.contact,
      ...input?.contact,
      address: {
        ...blankCompanyInfo.contact.address,
        ...input?.contact?.address,
      },
    },
    socialMedia: {
      ...blankCompanyInfo.socialMedia,
      ...input?.socialMedia,
    },
  });
}

export function toCompanyInfoPayload(form: CompanyInfoFormValues): CompanyInfo {
  const parsed = companyInfoSchema.parse(form);

  return {
    ...parsed,
    socialMedia: normalizeSocialMedia(parsed.socialMedia),
  };
}
```

- [ ] **Step 6: Fix the test import**

The test should import `companyInfoSchema` from `companyInfo.mapper` as written above. Do not import schema from the schema file in the test; the mapper module intentionally re-exports the feature model public helpers for this local test.

- [ ] **Step 7: Run mapper tests**

Run:

```powershell
npm.cmd test -- src/features/company-info/model/companyInfo.mapper.test.ts
```

Expected: mapper tests pass.

- [ ] **Step 8: Commit model layer**

```powershell
git add src/features/company-info/model
git commit -m "feat: add company info model mapping"
```

---

## Task 3: Add Company Info API And Query Keys

**Files:**
- Create: `src/features/company-info/api/companyInfo.keys.ts`
- Create: `src/features/company-info/api/companyInfo.api.ts`
- Create: `src/features/company-info/api/companyInfo.api.test.ts`

- [ ] **Step 1: Write failing API tests**

Create `src/features/company-info/api/companyInfo.api.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';
import { blankCompanyInfo } from '../model/companyInfo.defaults';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { getCompanyInfo, saveCompanyInfo } from './companyInfo.api';
import { companyInfoKeys } from './companyInfo.keys';

describe('company info api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('defines a stable detail query key', () => {
    expect(companyInfoKeys.detail()).toEqual(['company-info', 'detail']);
  });

  it('loads site settings from the existing config key', async () => {
    requestMock.mockResolvedValueOnce({ ...blankCompanyInfo, logo: '/logo.png' });

    await expect(getCompanyInfo()).resolves.toMatchObject({ logo: '/logo.png' });

    expect(requestMock).toHaveBeenCalledWith('/api/config/site_settings');
  });

  it('falls back to blank company info when the config is missing', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Missing', 404));

    await expect(getCompanyInfo()).resolves.toEqual(blankCompanyInfo);
  });

  it('saves site settings through the existing config endpoint', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await saveCompanyInfo(blankCompanyInfo);

    expect(requestMock).toHaveBeenCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'site_settings', value: blankCompanyInfo }),
    });
  });
});
```

- [ ] **Step 2: Run API tests and verify RED**

Run:

```powershell
npm.cmd test -- src/features/company-info/api/companyInfo.api.test.ts
```

Expected: FAIL because API files do not exist.

- [ ] **Step 3: Implement query keys**

Create `src/features/company-info/api/companyInfo.keys.ts`:

```ts
export const companyInfoKeys = {
  all: ['company-info'] as const,
  detail: () => [...companyInfoKeys.all, 'detail'] as const,
};
```

- [ ] **Step 4: Implement API functions**

Create `src/features/company-info/api/companyInfo.api.ts`:

```ts
import type { CompanyInfo } from '@/types';
import { apiClient } from '@/shared/api/client';
import { isAppError } from '@/shared/api/errors';
import { blankCompanyInfo } from '../model/companyInfo.defaults';
import { toCompanyInfoFormValues, toCompanyInfoPayload } from '../model/companyInfo.mapper';

const configKey = 'site_settings';

export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    const value = await apiClient.request<CompanyInfo | null>(`/api/config/${configKey}`);
    return toCompanyInfoPayload(toCompanyInfoFormValues(value));
  } catch (error) {
    if (isAppError(error) && error.status === 404) {
      return blankCompanyInfo;
    }
    throw error;
  }
}

export async function saveCompanyInfo(companyInfo: CompanyInfo): Promise<void> {
  await apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({
      key: configKey,
      value: companyInfo,
    }),
  });
}
```

- [ ] **Step 5: Run API tests**

Run:

```powershell
npm.cmd test -- src/features/company-info/api/companyInfo.api.test.ts src/features/company-info/model/companyInfo.mapper.test.ts
```

Expected: API and mapper tests pass.

- [ ] **Step 6: Commit API layer**

```powershell
git add src/features/company-info/api
git commit -m "feat: add company info api"
```

---

## Task 4: Add Company Info Form Controller Hook

**Files:**
- Create: `src/features/company-info/model/useCompanyInfoForm.ts`
- Create: `src/features/company-info/model/useCompanyInfoForm.test.tsx`

- [ ] **Step 1: Write failing hook tests**

Create `src/features/company-info/model/useCompanyInfoForm.test.tsx`:

```tsx
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppQueryClient } from '@/app/queryClient';
import { blankCompanyInfo } from './companyInfo.defaults';

const { getCompanyInfoMock, saveCompanyInfoMock } = vi.hoisted(() => ({
  getCompanyInfoMock: vi.fn(),
  saveCompanyInfoMock: vi.fn(),
}));

vi.mock('../api/companyInfo.api', () => ({
  getCompanyInfo: getCompanyInfoMock,
  saveCompanyInfo: saveCompanyInfoMock,
}));

import { useCompanyInfoForm } from './useCompanyInfoForm';

function createWrapper() {
  const client = createAppQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useCompanyInfoForm', () => {
  beforeEach(() => {
    getCompanyInfoMock.mockReset();
    saveCompanyInfoMock.mockReset();
  });

  it('loads company info and resets the form with server values', async () => {
    getCompanyInfoMock.mockResolvedValueOnce({
      ...blankCompanyInfo,
      name: { zh: '公司', en: 'Company' },
    });

    const { result } = renderHook(() => useCompanyInfoForm(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.form.getValues('name')).toEqual({ zh: '公司', en: 'Company' });
  });

  it('submits normalized payloads and marks the save as successful', async () => {
    getCompanyInfoMock.mockResolvedValueOnce(blankCompanyInfo);
    saveCompanyInfoMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCompanyInfoForm(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.form.setValue('socialMedia.instagram', '  https://instagram.example  ');
      result.current.form.setValue('socialMedia.twitter', '   ');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(saveCompanyInfoMock).toHaveBeenCalledWith({
      ...blankCompanyInfo,
      socialMedia: {
        instagram: 'https://instagram.example',
        twitter: undefined,
      },
    });
    expect(result.current.saved).toBe(true);
  });
});
```

- [ ] **Step 2: Run hook tests and verify RED**

Run:

```powershell
npm.cmd test -- src/features/company-info/model/useCompanyInfoForm.test.tsx
```

Expected: FAIL because `useCompanyInfoForm` does not exist.

- [ ] **Step 3: Implement hook**

Create `src/features/company-info/model/useCompanyInfoForm.ts`:

```ts
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getCompanyInfo, saveCompanyInfo } from '../api/companyInfo.api';
import { companyInfoKeys } from '../api/companyInfo.keys';
import { blankCompanyInfo } from './companyInfo.defaults';
import {
  companyInfoSchema,
  toCompanyInfoFormValues,
  toCompanyInfoPayload,
  type CompanyInfoFormValues,
} from './companyInfo.mapper';

export function useCompanyInfoForm() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: blankCompanyInfo,
  });

  const query = useQuery({
    queryKey: companyInfoKeys.detail(),
    queryFn: getCompanyInfo,
  });

  const mutation = useMutation({
    mutationFn: saveCompanyInfo,
    onSuccess: async (_result, payload) => {
      queryClient.setQueryData(companyInfoKeys.detail(), payload);
      form.reset(toCompanyInfoFormValues(payload));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    },
  });

  useEffect(() => {
    if (query.data && !form.formState.isDirty) {
      form.reset(toCompanyInfoFormValues(query.data));
    }
  }, [form, query.data]);

  async function submit() {
    const values = form.getValues();
    await mutation.mutateAsync(toCompanyInfoPayload(values));
  }

  return {
    form,
    submit,
    saved,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    queryError: query.error,
    mutationError: mutation.error,
    retry: query.refetch,
  };
}
```

- [ ] **Step 4: Run hook tests**

Run:

```powershell
npm.cmd test -- src/features/company-info/model/useCompanyInfoForm.test.tsx
```

Expected: hook tests pass.

- [ ] **Step 5: Commit hook**

```powershell
git add src/features/company-info/model/useCompanyInfoForm.ts src/features/company-info/model/useCompanyInfoForm.test.tsx
git commit -m "feat: add company info form controller"
```

---

## Task 5: Add Company Info Feature UI And Route It

**Files:**
- Create: `src/features/company-info/ui/CompanyInfoFormView.tsx`
- Create: `src/features/company-info/ui/CompanyInfoEditor.tsx`
- Create: `src/features/company-info/ui/CompanyInfoEditor.test.tsx`
- Create: `src/features/company-info/index.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write failing feature UI test**

Create `src/features/company-info/ui/CompanyInfoEditor.test.tsx`:

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppQueryClient } from '@/app/queryClient';
import { blankCompanyInfo } from '../model/companyInfo.defaults';

const { getCompanyInfoMock, saveCompanyInfoMock } = vi.hoisted(() => ({
  getCompanyInfoMock: vi.fn(),
  saveCompanyInfoMock: vi.fn(),
}));

vi.mock('../api/companyInfo.api', () => ({
  getCompanyInfo: getCompanyInfoMock,
  saveCompanyInfo: saveCompanyInfoMock,
}));

vi.mock('@/admin/components/ImageInput', () => ({
  default: ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
    <button type="button" onClick={() => onChange('/logo.png')}>
      {label}: {value}
    </button>
  ),
}));

import { CompanyInfoEditor } from './CompanyInfoEditor';

function renderEditor() {
  const client = createAppQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <CompanyInfoEditor />
    </QueryClientProvider>,
  );
}

describe('CompanyInfoEditor', () => {
  beforeEach(() => {
    getCompanyInfoMock.mockReset();
    saveCompanyInfoMock.mockReset();
  });

  it('renders loaded company info and saves edited values without ContentContext', async () => {
    const user = userEvent.setup();
    getCompanyInfoMock.mockResolvedValueOnce({
      ...blankCompanyInfo,
      name: { zh: '旧公司', en: 'Old Company' },
    });
    saveCompanyInfoMock.mockResolvedValueOnce(undefined);

    renderEditor();

    await waitFor(() => expect(screen.getByPlaceholderText('公司中文名称')).toHaveValue('旧公司'));

    await user.clear(screen.getByPlaceholderText('Company English Name'));
    await user.type(screen.getByPlaceholderText('Company English Name'), 'New Company');
    await user.click(screen.getByRole('button', { name: /保存更改/ }));

    await waitFor(() =>
      expect(saveCompanyInfoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: { zh: '旧公司', en: 'New Company' },
        }),
      ),
    );
    expect(screen.getByText('保存成功！')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run feature UI test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/company-info/ui/CompanyInfoEditor.test.tsx
```

Expected: FAIL because UI files do not exist.

- [ ] **Step 3: Implement `CompanyInfoFormView`**

Create `src/features/company-info/ui/CompanyInfoFormView.tsx`:

```tsx
import { motion } from 'framer-motion';
import { Building2, Loader2, Mail, MapPin, Phone, Save, Share2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import ImageInput from '@/admin/components/ImageInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import { BilingualTextareaControl } from '@/shared/forms/controls/BilingualTextareaControl';
import type { CompanyInfoFormValues } from '../model/companyInfo.mapper';

interface CompanyInfoFormViewProps {
  form: UseFormReturn<CompanyInfoFormValues>;
  onSubmit: () => void;
  saved: boolean;
  isSaving: boolean;
  errorMessage?: string;
}

export function CompanyInfoFormView({
  form,
  onSubmit,
  saved,
  isSaving,
  errorMessage,
}: CompanyInfoFormViewProps) {
  const { control, register, handleSubmit } = form;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">公司信息管理</h1>
          <p className="text-gray-500 mt-1">管理公司基本信息、联系方式和社交媒体链接</p>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          保存更改
        </Button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 px-4 py-3 rounded-lg"
        >
          保存成功！
        </motion.div>
      )}

      {errorMessage && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              公司名称、Logo 和简介会显示在网站的 Header、Footer 等位置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>公司名称</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <BilingualTextControl
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={{ zh: '公司中文名称', en: 'Company English Name' }}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>公司 Logo</Label>
              <Controller
                control={control}
                name="logo"
                render={({ field }) => (
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    label="上传 Logo"
                    maxWidth={400}
                  />
                )}
              />
              <p className="text-xs text-gray-500">建议尺寸: 200x60 像素，支持 PNG、JPG、SVG 格式</p>
            </div>

            <div className="space-y-2">
              <Label>公司简介</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <BilingualTextareaControl
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={{ zh: '请输入公司简介', en: 'Enter company description' }}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              联系方式
            </CardTitle>
            <CardDescription>
              客户联系信息，会显示在 Footer 和联系页面
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  联系电话
                </Label>
                <Input {...register('contact.phone')} placeholder="+86 138-0000-0000" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  电子邮箱
                </Label>
                <Input type="email" {...register('contact.email')} placeholder="contact@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                公司地址
              </Label>
              <Controller
                control={control}
                name="contact.address"
                render={({ field }) => (
                  <BilingualTextControl
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={{ zh: '请输入公司地址', en: 'Enter company address' }}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              社交媒体
            </CardTitle>
            <CardDescription>
              社交媒体链接，会显示在 Footer 的社交图标区域
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>微信公众号 ID</Label>
                <Input {...register('socialMedia.wechat')} placeholder="wechat_id" />
              </div>
              <div className="space-y-2">
                <Label>微博主页</Label>
                <Input {...register('socialMedia.weibo')} placeholder="https://weibo.com/..." />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input {...register('socialMedia.facebook')} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input {...register('socialMedia.instagram')} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input {...register('socialMedia.twitter')} placeholder="https://twitter.com/..." />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input {...register('socialMedia.linkedin')} placeholder="https://linkedin.com/company/..." />
              </div>
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input {...register('socialMedia.tiktok')} placeholder="https://tiktok.com/..." />
              </div>
              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input {...register('socialMedia.youtube')} placeholder="https://youtube.com/..." />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input {...register('socialMedia.whatsapp')} placeholder="https://whatsapp.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Implement container**

Create `src/features/company-info/ui/CompanyInfoEditor.tsx`:

```tsx
import { toAppError } from '@/shared/api/errors';
import { useCompanyInfoForm } from '../model/useCompanyInfoForm';
import { CompanyInfoFormView } from './CompanyInfoFormView';

export function CompanyInfoEditor() {
  const {
    form,
    submit,
    saved,
    isLoading,
    isSaving,
    queryError,
    mutationError,
    retry,
  } = useCompanyInfoForm();

  if (isLoading) {
    return <div className="text-gray-500">正在加载公司信息...</div>;
  }

  if (queryError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {toAppError(queryError).message}
        </div>
        <button className="text-sm underline" type="button" onClick={() => retry()}>
          重试
        </button>
      </div>
    );
  }

  return (
    <CompanyInfoFormView
      form={form}
      onSubmit={submit}
      saved={saved}
      isSaving={isSaving}
      errorMessage={mutationError ? toAppError(mutationError).message : undefined}
    />
  );
}
```

- [ ] **Step 5: Add feature public index**

Create `src/features/company-info/index.ts`:

```ts
export { CompanyInfoEditor } from './ui/CompanyInfoEditor';
export type { CompanyInfoFormValues } from './model/companyInfo.mapper';
```

- [ ] **Step 6: Route `/company` through the feature public API**

Modify `src/App.tsx`:

```tsx
import { CompanyInfoEditor } from '@/features/company-info';
```

Remove the old line:

```tsx
import CompanyInfoEditor from './admin/editors/CompanyInfoEditor';
```

Do not change the route path:

```tsx
<Route path="company" element={<CompanyInfoEditor />} />
```

- [ ] **Step 7: Run feature UI test**

Run:

```powershell
npm.cmd test -- src/features/company-info/ui/CompanyInfoEditor.test.tsx
```

Expected: feature UI test passes.

- [ ] **Step 8: Verify feature boundary imports**

Run:

```powershell
npx.cmd eslint --print-config src/features/company-info/ui/CompanyInfoEditor.tsx
```

Expected: `no-restricted-imports` includes restrictions against `@/lib/api`, `@/shared/api/client`, and `@/context/ContentContext`.

- [ ] **Step 9: Commit feature UI and route**

```powershell
git add src/features/company-info src/App.tsx
git commit -m "feat: route company info through feature module"
```

---

## Task 6: Documentation And Final Verification

**Files:**
- Modify: `docs/README.md`

- [ ] **Step 1: Update project navigation**

Modify `docs/README.md` to add the company-info feature under the `features/` section. Keep the existing encoding/content style intact as much as possible, but the new meaning must be clear:

```text
features/
└── company-info/   公司信息样板迁移：Query、Mutation、Schema、Mapper、Form Controller、View
```

Also note that `/company` now uses the new feature module while legacy `ContentContext` remains for modules not yet migrated.

- [ ] **Step 2: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/shared/forms/controls/BilingualTextControl.test.tsx src/shared/forms/controls/BilingualTextareaControl.test.tsx src/features/company-info
```

Expected: all company-info and shared-control tests pass.

- [ ] **Step 3: Run full test suite**

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

Expected: build passes. The existing Vite large chunk warning is acceptable.

- [ ] **Step 5: Run lint and compare with baseline**

Run:

```powershell
npm.cmd run lint
```

Expected: the repository may still report the existing baseline of `87 problems (82 errors, 5 warnings)`. New files under `src/features/company-info` and `src/shared/forms` must not add lint errors.

- [ ] **Step 6: Confirm excluded scopes were not modified**

Run:

```powershell
git diff --name-only 7e0f01c..HEAD -- src/components/blocks
git diff --name-only 7e0f01c..HEAD -- src/context/ContentContext.tsx
git diff --name-only 7e0f01c..HEAD -- src/admin/editors/CompanyInfoEditor.tsx
```

Expected: no output for all three commands.

- [ ] **Step 7: Commit docs**

```powershell
git add docs/README.md
git commit -m "docs: document company info feature migration"
```

- [ ] **Step 8: Final status check**

Run:

```powershell
git status --short
git log --oneline -8
```

Expected: only the pre-existing untracked `.codegraph/` may remain. Recent commits should cover shared bilingual controls, company-info model, company-info API, company-info form controller, feature UI routing, and docs.

---

## Completion Criteria

- `/company` uses `@/features/company-info`.
- Company-info UI files do not import `ContentContext`, `@/lib/api`, or `@/shared/api/client`.
- Company-info API files are the only new files in this feature that call the shared API client.
- Saving company information updates the company-info query cache only.
- Legacy `ContentContext` and the old admin company editor remain untouched.
- `src/components/blocks` remains untouched.
- Targeted tests, full tests, and production build pass.
- Lint baseline is not worsened.
