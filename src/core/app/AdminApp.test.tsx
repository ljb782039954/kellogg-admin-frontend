import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminApp } from './AdminApp';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('AdminApp', () => {
  it('在 Provider + Router 下渲染项目包的首个 screen', async () => {
    render(<AdminApp projectPackage={fakeProjectPackage} />);
    expect(await screen.findByText('screen')).toBeInTheDocument();
  });
});
