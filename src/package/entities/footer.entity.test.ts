import { describe, expect, it } from 'vitest';
import { footerAdapter } from '@/package/adapters/footer.adapter';
import { footerEntity } from './footer.entity';

describe('footerEntity', () => {
  it('以仅更新的配置单例接入 footer screen', () => {
    expect(footerEntity.key).toBe('footer');
    expect(footerEntity.endpoint).toBe('/api/config');
    expect(footerEntity.capabilities).toEqual({ update: true });
    expect(footerEntity.screens).toEqual({ editor: 'footer' });
    expect(footerEntity.adapter).toBe(footerAdapter);
  });
});
