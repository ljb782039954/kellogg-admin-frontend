import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/core/app/LanguageContext';
import { RouteLifecycle } from './RouteLifecycle';

describe('RouteLifecycle', () => {
  it('sets the document title from route and project identity', async () => {
    render(
      <LanguageProvider>
        <RouteLifecycle
          identity={{
            key: 'test',
            name: { zh: '测试后台', en: 'Test Admin' },
            languages: ['zh', 'en'],
            defaultLanguage: 'zh',
          }}
          title={{ zh: '概览', en: 'Dashboard' }}
        >
          <div>screen</div>
        </RouteLifecycle>
      </LanguageProvider>,
    );

    await waitFor(() => expect(document.title).toBe('概览 - 测试后台'));
  });
});
