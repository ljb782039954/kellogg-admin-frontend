import { describe, it, expect } from 'vitest';
import { waitFor } from '@testing-library/react';
import { createAdminApp } from './createAdminApp';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('createAdminApp', () => {
  it('返回带 mount 方法的句柄', () => {
    const handle = createAdminApp(fakeProjectPackage);
    expect(handle.mount).toBeTypeOf('function');
  });

  it('mount 将应用渲染进给定容器', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    createAdminApp(fakeProjectPackage).mount(container);
    // 使用 waitFor 等待 React 和路由完成导航和渲染
    await waitFor(() => {
      expect(container.textContent).toContain('screen');
    });
    container.remove();
  });
});
