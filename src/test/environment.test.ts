import { describe, expect, it } from 'vitest';

describe('test environment', () => {
  it('provides a jsdom document', () => {
    const element = document.createElement('div');
    element.textContent = 'admin test environment';

    expect(element).toHaveTextContent('admin test environment');
  });
});
