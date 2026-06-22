import { describe, expect, it } from 'vitest';
import { navigationAdapter } from '@/package/adapters/navigation.adapter';
import { navigationEntity } from './navigation.entity';

describe('navigationEntity', () => {
  it('以仅更新的配置单例接入 header screen', () => {
    expect(navigationEntity.key).toBe('navigation');
    expect(navigationEntity.endpoint).toBe('/api/config');
    expect(navigationEntity.capabilities).toEqual({ update: true });
    expect(navigationEntity.screens).toEqual({ editor: 'header' });
    expect(navigationEntity.adapter).toBe(navigationAdapter);
  });
});
