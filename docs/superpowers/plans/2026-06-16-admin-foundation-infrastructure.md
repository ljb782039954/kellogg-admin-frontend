# Admin Foundation Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `adminApp` 建立可渐进迁移的 TanStack Query、统一 API client、统一错误模型、测试环境和架构依赖规则，同时保持现有路由、页面行为及 `ContentContext` 不变。

**Architecture:** 本计划只实施已批准设计中的第一批“基础设施”，不迁移公司信息、产品或其他业务模块。新基础设施通过兼容层接入现有 `src/lib/api.ts`，Query Provider 放在应用根部，旧页面继续按原方式运行；后续 feature 可以直接建立独立 Query、Mutation、Schema 和 View。

**Tech Stack:** React 19、TypeScript 5.9、Vite 7、TanStack Query、Vitest、Testing Library、MSW、ESLint 9、npm

---

## 实施范围

本计划完成以下内容：

- 安装并配置 TanStack Query。
- 建立 Vitest、Testing Library、jsdom 和 MSW 测试底座。
- 建立统一 `AppError`、兼容 `ApiError` 和通用 API client。
- 让现有 `src/lib/api.ts` 使用新 API client，但保持原有 `api` 对象接口不变。
- 在应用入口接入 `QueryClientProvider`。
- 为新 `features`、`shared` 代码增加最小 ESLint 依赖边界。
- 更新后台导航文档，记录新代码的放置规则。

本计划不包含：

- 不迁移任何现有业务页面到 `features/`。
- 不删除或缩小 `ContentContext`。
- 不修改 `src/components/blocks/`。
- 不建立双语字段、图片上传或公司信息 feature；这些属于后续独立计划。
- 不改变后端 API 契约、路由或后台视觉。

## 文件结构

### 新建文件

```text
adminApp/
├─ vitest.config.ts
└─ src/
   ├─ app/
   │  ├─ queryClient.ts
   │  ├─ queryClient.test.ts
   │  └─ providers/
   │     ├─ QueryProvider.tsx
   │     └─ QueryProvider.test.tsx
   ├─ shared/
   │  └─ api/
   │     ├─ config.ts
   │     ├─ errors.ts
   │     ├─ errors.test.ts
   │     ├─ client.ts
   │     └─ client.test.ts
   └─ test/
      ├─ setup.ts
      ├─ environment.test.ts
      └─ mocks/
         └─ server.ts
```

### 修改文件

```text
adminApp/
├─ package.json
├─ package-lock.json
├─ tsconfig.node.json
├─ eslint.config.js
├─ docs/README.md
└─ src/
   ├─ main.tsx
   └─ lib/
      ├─ api.ts
      └─ api.test.ts
```

## Task 1: 安装依赖并建立测试运行环境

**Files:**
- Modify: `adminApp/package.json`
- Modify: `adminApp/package-lock.json`
- Modify: `adminApp/tsconfig.node.json`
- Create: `adminApp/vitest.config.ts`
- Create: `adminApp/src/test/setup.ts`
- Create: `adminApp/src/test/mocks/server.ts`
- Create: `adminApp/src/test/environment.test.ts`

- [ ] **Step 1: 记录改动前基线**

在 Windows PowerShell 中使用 `npm.cmd`，避免系统执行策略拦截 `npm.ps1`：

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected:

- 记录两条命令的退出码和错误摘要。
- 如果现有全仓 lint 已失败，将原有错误视为基线；后续不得增加错误。
- build 必须在基础设施改动前后保持相同结果；若基线失败，先确认失败与本计划无关再继续。

- [ ] **Step 2: 安装运行时与测试依赖**

Run:

```powershell
npm.cmd install @tanstack/react-query
npm.cmd install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

Expected:

- `package.json` 的 `dependencies` 出现 `@tanstack/react-query`。
- `devDependencies` 出现 Vitest、jsdom、Testing Library 和 MSW。
- `package-lock.json` 同步更新。

- [ ] **Step 3: 添加测试脚本**

将 `package.json` 的 `scripts` 调整为：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  }
}
```

只修改 `scripts`，保留 npm 安装后生成的依赖版本。

- [ ] **Step 4: 创建 Vitest 配置**

创建 `vitest.config.ts`：

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    css: true,
  },
});
```

- [ ] **Step 5: 让 TypeScript 检查 Vitest 配置**

将 `tsconfig.node.json` 完整更新为：

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 6: 创建 MSW 测试服务器与全局 setup**

创建 `src/test/mocks/server.ts`：

```ts
import { setupServer } from 'msw/node';

export const server = setupServer();
```

创建 `src/test/setup.ts`：

```ts
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- [ ] **Step 7: 写测试环境验证用例**

创建 `src/test/environment.test.ts`：

```ts
import { describe, expect, it } from 'vitest';

describe('test environment', () => {
  it('provides a jsdom document', () => {
    const element = document.createElement('div');
    element.textContent = 'admin test environment';

    expect(element).toHaveTextContent('admin test environment');
  });
});
```

- [ ] **Step 8: 运行测试环境验证**

Run:

```powershell
npm.cmd test -- src/test/environment.test.ts
```

Expected: `1 passed`，没有未处理的 MSW 请求。

- [ ] **Step 9: 提交测试底座**

```powershell
git add package.json package-lock.json tsconfig.node.json vitest.config.ts src/test
git commit -m "test: add admin app test infrastructure"
```

## Task 2: 建立统一错误模型

**Files:**
- Create: `adminApp/src/shared/api/errors.ts`
- Test: `adminApp/src/shared/api/errors.test.ts`

- [ ] **Step 1: 写失败测试**

创建 `src/shared/api/errors.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { ApiError, AppError, isAppError, toAppError } from './errors';

describe('AppError', () => {
  it('stores stable application error metadata', () => {
    const cause = new Error('socket closed');
    const error = new AppError({
      code: 'NETWORK_ERROR',
      message: '无法连接服务器',
      status: 503,
      details: { retryable: true },
      cause,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.status).toBe(503);
    expect(error.details).toEqual({ retryable: true });
    expect(error.cause).toBe(cause);
    expect(isAppError(error)).toBe(true);
  });

  it('keeps the legacy ApiError constructor contract', () => {
    const error = new ApiError('Not found', 404, { resource: 'page' });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('ApiError');
    expect(error.code).toBe('HTTP_ERROR');
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ resource: 'page' });
  });

  it('normalizes unknown thrown values', () => {
    const normalized = toAppError('offline');

    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.code).toBe('UNKNOWN_ERROR');
    expect(normalized.message).toBe('offline');
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd test -- src/shared/api/errors.test.ts
```

Expected: FAIL，提示无法解析 `./errors`。

- [ ] **Step 3: 实现错误模型**

创建 `src/shared/api/errors.ts`：

```ts
export interface AppErrorOptions {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;
  override readonly cause?: unknown;

  constructor({ code, message, status, details, cause }: AppErrorOptions) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.cause = cause;
  }
}

export class ApiError extends AppError {
  constructor(message: string, status: number, data?: unknown) {
    super({
      code: 'HTTP_ERROR',
      message,
      status,
      details: data,
    });
    this.name = 'ApiError';
  }

  get data(): unknown {
    return this.details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      code: 'UNKNOWN_ERROR',
      message: error.message,
      cause: error,
    });
  }

  return new AppError({
    code: 'UNKNOWN_ERROR',
    message: String(error),
    cause: error,
  });
}
```

- [ ] **Step 4: 运行测试并确认通过**

Run:

```powershell
npm.cmd test -- src/shared/api/errors.test.ts
```

Expected: `3 passed`。

- [ ] **Step 5: 提交错误模型**

```powershell
git add src/shared/api/errors.ts src/shared/api/errors.test.ts
git commit -m "feat: add shared application error model"
```

## Task 3: 建立通用 API client

**Files:**
- Create: `adminApp/src/shared/api/config.ts`
- Create: `adminApp/src/shared/api/client.ts`
- Test: `adminApp/src/shared/api/client.test.ts`

- [ ] **Step 1: 写 API client 失败测试**

创建 `src/shared/api/client.test.ts`：

```ts
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/mocks/server';
import { createApiClient } from './client';
import { ApiError, AppError } from './errors';

const baseUrl = 'https://admin-api.test';

describe('createApiClient', () => {
  it('adds the admin token and parses JSON responses', async () => {
    server.use(
      http.get(`${baseUrl}/api/health`, ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer secret-token');
        expect(request.headers.get('Content-Type')).toBe('application/json');
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createApiClient({ baseUrl, token: 'secret-token' });

    await expect(client.request<{ ok: boolean }>('/api/health')).resolves.toEqual({ ok: true });
  });

  it('converts non-success responses to ApiError', async () => {
    server.use(
      http.get(`${baseUrl}/api/missing`, () =>
        HttpResponse.json({ error: 'Missing resource' }, { status: 404 }),
      ),
    );

    const client = createApiClient({ baseUrl });
    const error = await client.request('/api/missing').catch((cause) => cause);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      name: 'ApiError',
      code: 'HTTP_ERROR',
      message: 'Missing resource',
      status: 404,
    });
  });

  it('reports invalid successful JSON responses', async () => {
    server.use(
      http.get(
        `${baseUrl}/api/invalid-json`,
        () => new HttpResponse('not-json', { status: 200 }),
      ),
    );

    const client = createApiClient({ baseUrl });
    const error = await client.request('/api/invalid-json').catch((cause) => cause);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });

  it('does not force a JSON content type for FormData', async () => {
    server.use(
      http.post(`${baseUrl}/api/upload`, ({ request }) => {
        expect(request.headers.get('Content-Type')).toContain('multipart/form-data');
        return HttpResponse.json({ url: '/uploaded/image.jpg' });
      }),
    );

    const formData = new FormData();
    formData.append('file', new File(['image'], 'image.jpg', { type: 'image/jpeg' }));
    const client = createApiClient({ baseUrl });

    await expect(
      client.request<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      }),
    ).resolves.toEqual({ url: '/uploaded/image.jpg' });
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd test -- src/shared/api/client.test.ts
```

Expected: FAIL，提示无法解析 `./client`。

- [ ] **Step 3: 集中环境配置**

创建 `src/shared/api/config.ts`：

```ts
const isLocalDev = import.meta.env.VITE_IS_LOCAL_DEV === 'true';

export const apiBaseUrl = isLocalDev
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL ?? '')
  : (import.meta.env.VITE_API_BASE_URL ?? '');

export const adminToken = isLocalDev
  ? import.meta.env.VITE_ADMIN_TOKEN_LOCAL
  : import.meta.env.VITE_ADMIN_TOKEN;
```

- [ ] **Step 4: 实现 API client**

创建 `src/shared/api/client.ts`：

```ts
import { adminToken, apiBaseUrl } from './config';
import { ApiError, AppError } from './errors';

interface ApiClientOptions {
  baseUrl: string;
  token?: string;
  fetcher?: typeof fetch;
}

function joinUrl(baseUrl: string, path: string): string {
  if (!baseUrl) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function isFormData(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function readErrorMessage(data: unknown, fallback: string): string {
  if (typeof data !== 'object' || data === null) {
    return fallback;
  }

  const payload = data as Record<string, unknown>;
  if (typeof payload.error === 'string') {
    return payload.error;
  }
  if (typeof payload.message === 'string') {
    return payload.message;
  }
  return fallback;
}

export function createApiClient({
  baseUrl,
  token,
  fetcher = fetch,
}: ApiClientOptions) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (!isFormData(options.body) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetcher(joinUrl(baseUrl, path), {
        ...options,
        headers,
      });
    } catch (cause) {
      throw new AppError({
        code: 'NETWORK_ERROR',
        message: '无法连接到服务器',
        cause,
      });
    }

    const text = await response.text();
    let data: unknown = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (cause) {
        if (response.ok) {
          throw new AppError({
            code: 'INVALID_RESPONSE',
            message: '服务器返回了无法解析的数据',
            status: response.status,
            details: text,
            cause,
          });
        }
      }
    }

    if (!response.ok) {
      throw new ApiError(
        readErrorMessage(data, response.statusText || 'Request failed'),
        response.status,
        data,
      );
    }

    return data as T;
  }

  return { request };
}

export const apiClient = createApiClient({
  baseUrl: apiBaseUrl,
  token: adminToken,
});
```

- [ ] **Step 5: 运行 API client 测试**

Run:

```powershell
npm.cmd test -- src/shared/api/client.test.ts
```

Expected: `4 passed`。

- [ ] **Step 6: 提交 API client**

```powershell
git add src/shared/api/config.ts src/shared/api/client.ts src/shared/api/client.test.ts
git commit -m "feat: add shared admin api client"
```

## Task 4: 将旧 API facade 接到新 client

**Files:**
- Modify: `adminApp/src/lib/api.ts`
- Test: `adminApp/src/lib/api.test.ts`

- [ ] **Step 1: 写兼容行为失败测试**

创建 `src/lib/api.test.ts`：

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { api } from './api';

describe('legacy api facade', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('keeps product request paths unchanged', async () => {
    requestMock.mockResolvedValueOnce({ id: 7 });

    await api.getProduct(7);

    expect(requestMock).toHaveBeenCalledWith('/api/products/7');
  });

  it('keeps missing config behavior unchanged', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Missing', 404));

    await expect(api.getConfig('missing')).resolves.toBeNull();
  });

  it('delegates multipart uploads to the shared client', async () => {
    requestMock.mockResolvedValueOnce({
      url: '/image.jpg',
      thumbUrl: '/image-thumb.jpg',
      key: 'image.jpg',
    });
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    await api.uploadImage(file, { width: 100, height: 80 }, 'hash-value');

    const [path, options] = requestMock.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/api/upload');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('hash')).toBe('hash-value');
  });
});
```

- [ ] **Step 2: 运行测试并确认失败原因**

Run:

```powershell
npm.cmd test -- src/lib/api.test.ts
```

Expected: 至少上传委托测试 FAIL，因为旧实现直接调用 `fetch`，尚未使用 `apiClient`。

- [ ] **Step 3: 替换 `api.ts` 顶部的请求基础设施**

删除 `src/lib/api.ts` 中的以下内容：

- `API_BASE`
- `ADMIN_TOKEN`
- 本地 `ApiError` 类
- 本地 `request<T>()` 函数

在类型 import 后添加：

```ts
import { apiClient } from '@/shared/api/client';

export { ApiError, AppError } from '@/shared/api/errors';

const request = apiClient.request;
```

保留现有 `api` 对象中的产品、分类、配置、博客、评价等公开方法及参数结构不变。

- [ ] **Step 4: 将上传请求改为共享 client**

将 `uploadImage` 方法替换为：

```ts
uploadImage: async (
  file: File,
  dimensions?: { width: number; height: number },
  hash?: string,
): Promise<{ url: string; thumbUrl: string; key: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  if (dimensions) {
    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());
  }
  if (hash) {
    formData.append('hash', hash);
  }

  return request('/api/upload', {
    method: 'POST',
    body: formData,
  });
},
```

不要在此任务中拆分各业务 endpoint；`api` facade 是迁移期间的兼容入口。

- [ ] **Step 5: 运行兼容测试与共享 API 测试**

Run:

```powershell
npm.cmd test -- src/lib/api.test.ts src/shared/api/client.test.ts src/shared/api/errors.test.ts
```

Expected: `10 passed`。

- [ ] **Step 6: 执行 TypeScript 与生产构建验证**

Run:

```powershell
npm.cmd run build
```

Expected: 与 Task 1 记录的 build 基线一致；若基线通过，此处必须通过。

- [ ] **Step 7: 提交兼容迁移**

```powershell
git add src/lib/api.ts src/lib/api.test.ts
git commit -m "refactor: route legacy api through shared client"
```

## Task 5: 建立 QueryClient 默认策略

**Files:**
- Create: `adminApp/src/app/queryClient.ts`
- Test: `adminApp/src/app/queryClient.test.ts`

- [ ] **Step 1: 写 QueryClient 策略失败测试**

创建 `src/app/queryClient.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { AppError } from '@/shared/api/errors';
import { createAppQueryClient } from './queryClient';

describe('createAppQueryClient', () => {
  it('uses conservative server-state defaults', () => {
    const client = createAppQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.gcTime).toBe(5 * 60_000);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.mutations?.retry).toBe(0);
  });

  it('does not retry client-side HTTP errors', () => {
    const client = createAppQueryClient();
    const retry = client.getDefaultOptions().queries?.retry;
    const error = new AppError({
      code: 'HTTP_ERROR',
      message: 'Bad request',
      status: 400,
    });

    expect(typeof retry).toBe('function');
    expect((retry as (failureCount: number, error: Error) => boolean)(0, error)).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd test -- src/app/queryClient.test.ts
```

Expected: FAIL，提示无法解析 `./queryClient`。

- [ ] **Step 3: 实现 QueryClient 工厂和应用单例**

创建 `src/app/queryClient.ts`：

```ts
import { QueryClient } from '@tanstack/react-query';
import { isAppError } from '@/shared/api/errors';

function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (isAppError(error) && error.status !== undefined && error.status < 500) {
    return false;
  }

  return failureCount < 1;
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
```

- [ ] **Step 4: 运行 QueryClient 测试**

Run:

```powershell
npm.cmd test -- src/app/queryClient.test.ts
```

Expected: `2 passed`。

- [ ] **Step 5: 提交 QueryClient**

```powershell
git add src/app/queryClient.ts src/app/queryClient.test.ts
git commit -m "feat: configure admin query client"
```

## Task 6: 接入根级 QueryProvider

**Files:**
- Create: `adminApp/src/app/providers/QueryProvider.tsx`
- Test: `adminApp/src/app/providers/QueryProvider.test.tsx`
- Modify: `adminApp/src/main.tsx`

- [ ] **Step 1: 写 Provider 失败测试**

创建 `src/app/providers/QueryProvider.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { createAppQueryClient } from '../queryClient';
import { QueryProvider } from './QueryProvider';

function QueryClientProbe() {
  const client = useQueryClient();
  return <span>{client ? 'query-ready' : 'query-missing'}</span>;
}

describe('QueryProvider', () => {
  it('makes the supplied QueryClient available to descendants', () => {
    const client = createAppQueryClient();

    render(
      <QueryProvider client={client}>
        <QueryClientProbe />
      </QueryProvider>,
    );

    expect(screen.getByText('query-ready')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
npm.cmd test -- src/app/providers/QueryProvider.test.tsx
```

Expected: FAIL，提示无法解析 `./QueryProvider`。

- [ ] **Step 3: 实现 Provider**

创建 `src/app/providers/QueryProvider.tsx`：

```tsx
import type { ReactNode } from 'react';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { queryClient } from '../queryClient';

interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export function QueryProvider({
  children,
  client = queryClient,
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: 运行 Provider 测试**

Run:

```powershell
npm.cmd test -- src/app/providers/QueryProvider.test.tsx
```

Expected: `1 passed`。

- [ ] **Step 5: 在应用入口接入 Provider**

将 `src/main.tsx` 完整更新为：

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from '@/app/providers/QueryProvider';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
```

不要调整 `App.tsx` 中 `LanguageProvider`、`ContentProvider`、Router 或 Toaster 的相对顺序。Query Provider 与旧 Context 在迁移期间并存。

- [ ] **Step 6: 运行全部现有测试与构建**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected:

- 当前计划新增的 14 个测试全部通过。
- build 结果与 Task 1 基线一致；基线通过时必须继续通过。

- [ ] **Step 7: 提交根级 Provider**

```powershell
git add src/app/providers/QueryProvider.tsx src/app/providers/QueryProvider.test.tsx src/main.tsx
git commit -m "feat: provide query client at app root"
```

## Task 7: 添加新架构的 ESLint 依赖边界

**Files:**
- Modify: `adminApp/eslint.config.js`

- [ ] **Step 1: 更新 ESLint 配置**

将 `eslint.config.js` 完整更新为：

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const privateFeatureImports = [
  {
    group: [
      '@/features/*/api/*',
      '@/features/*/model/*',
      '@/features/*/ui/*',
    ],
    message: 'Import another feature through its public index.ts only.',
  },
]

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: privateFeatureImports }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...privateFeatureImports,
            {
              group: ['@/features/*', '@/features/**'],
              message: 'Shared code must not depend on business features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/api',
              message: 'Feature UI must call a controller or feature query, not the legacy API facade.',
            },
            {
              name: '@/shared/api/client',
              message: 'Feature UI must not call the shared API client directly.',
            },
            {
              name: '@/context/ContentContext',
              message: 'New feature UI must not add dependencies on ContentContext.',
            },
          ],
          patterns: privateFeatureImports,
        },
      ],
    },
  },
])
```

这组规则只约束新 `features` 和 `shared` 边界，不要求本批次迁移旧 `src/admin` 页面。

- [ ] **Step 2: 验证 ESLint 能解析边界规则**

Run:

```powershell
npx.cmd eslint --print-config src/features/example/ui/ExampleView.tsx
```

Expected: 输出的 `no-restricted-imports` 配置包含 `@/lib/api`、`@/shared/api/client` 和 `@/context/ContentContext`。

- [ ] **Step 3: 运行全仓 lint 并与基线比较**

Run:

```powershell
npm.cmd run lint
```

Expected:

- 如果 Task 1 基线为 PASS，此处必须 PASS。
- 如果 Task 1 记录了旧错误，错误集合不得新增；新增文件 `src/app`、`src/shared`、`src/test` 和 `vitest.config.ts` 不得产生 lint 错误。

- [ ] **Step 4: 提交边界规则**

```powershell
git add eslint.config.js
git commit -m "chore: enforce feature dependency boundaries"
```

## Task 8: 更新项目导航并执行最终验证

**Files:**
- Modify: `adminApp/docs/README.md`

- [ ] **Step 1: 在目录导航中记录新基础设施**

在 `docs/README.md` 的 `src/ 目录导航` 代码块中加入：

```text
app/
├── providers/QueryProvider.tsx  TanStack Query 根 Provider
└── queryClient.ts               Query 默认缓存与重试策略
features/                        新业务模块目录（后续按领域渐进迁入）
shared/
└── api/                         API client、环境配置与统一错误模型
test/                            Vitest、Testing Library 与 MSW 测试底座
```

在“架构要点”前加入：

```markdown
### 渐进重构约束

新业务代码按 `features/<domain>/{api,model,ui}` 组织，并通过 feature 根部 `index.ts` 暴露公共能力。`shared` 不得依赖 `features`，新 feature UI 不得直接调用 `lib/api`、`shared/api/client` 或新增对 `ContentContext` 的依赖。旧模块在迁移完成前继续保持现状。
```

- [ ] **Step 2: 运行完整测试**

Run:

```powershell
npm.cmd test
```

Expected: 当前计划新增的 14 个测试全部通过，无未处理 MSW 请求。

- [ ] **Step 3: 运行生产构建**

Run:

```powershell
npm.cmd run build
```

Expected: 与 Task 1 基线一致；基线通过时必须生成 `dist/` 且退出码为 0。

- [ ] **Step 4: 运行 lint 检查**

Run:

```powershell
npm.cmd run lint
```

Expected: 不新增 lint 错误；若存在 Task 1 已记录的历史错误，在实施记录中列出原始错误与当前错误的对比。

- [ ] **Step 5: 确认排除范围未被修改**

Run:

```powershell
git diff --name-only HEAD~7..HEAD -- src/components/blocks
git diff --name-only HEAD~7..HEAD -- src/admin
```

Expected: 两条命令均无输出。本批次不修改 blocks，也不迁移现有 admin 页面。

- [ ] **Step 6: 提交导航文档**

```powershell
git add docs/README.md
git commit -m "docs: document admin foundation architecture"
```

- [ ] **Step 7: 检查最终改动状态**

Run:

```powershell
git status --short
git log --oneline -8
```

Expected:

- 除用户已有的 `.codegraph/` 外没有未提交的本计划文件。
- 最近提交依次覆盖测试底座、错误模型、API client、旧 API 兼容、QueryClient、Provider、ESLint 和文档。若实现过程中将相邻的小提交合并，提交内容仍须保持上述职责边界。

## 完成判定

满足以下条件后，第一批基础设施才算完成：

- `@tanstack/react-query` 已接入应用根部。
- 旧 `ContentProvider` 和全部现有路由继续存在。
- 现有 `api` 对象的公开调用方式未改变。
- JSON 请求、HTTP 错误、无效响应和 FormData 上传均有测试。
- QueryClient 默认缓存和重试策略有测试。
- Vitest、Testing Library 和 MSW 可以通过 `npm.cmd test` 运行。
- 新 feature UI 无法通过别名直接导入旧 API facade、共享 client 或 `ContentContext`。
- `src/components/blocks/` 和 `src/admin/` 没有本批次改动。
- build 结果不劣于实施前基线。
- 下一批公司信息样板可以直接复用 Query Provider、API client、错误模型和测试工具。

## 后续独立计划

基础设施完成并验收后，再分别编写和执行：

1. 公司信息样板与双语字段计划。
2. 图片上传与查重 Controller 计划。
3. 分类 Query 与 CRUD 计划。
4. 产品列表与单产品编辑会话计划。
5. 导航、页脚、页面编辑器及其他业务域迁移计划。

这些计划不得与本计划并行修改相同基础设施文件。
