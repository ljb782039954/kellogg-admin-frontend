import { useQueryClient } from '@tanstack/react-query';
import { useEntityMutationController } from '@/core/entities';
import type { CustomPage } from '@/types';
import { savePageDetail, savePagesIndex } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { sanitizePageIndex } from './pages.mapper';

export function useSavePage() {
  const queryClient = useQueryClient();

  const mutation = useEntityMutationController<
    CustomPage,
    CustomPage,
    string,
    CustomPage
  >({
    keys: pageKeys,
    execute: async (page) => {
      await savePageDetail(page.id, page);

      const currentIndex = queryClient.getQueryData<CustomPage[]>(pageKeys.list()) ?? [];
      const nextIndex = currentIndex.map((entry) =>
        entry.id === page.id ? page : entry,
      );
      await savePagesIndex(sanitizePageIndex(nextIndex) as unknown as Record<string, unknown>[]);

      return page;
    },
    resolveId: (page) => page.id,
    selectModel: (page) => page,
  });

  return {
    savePage: mutation.mutate,
    isSaving: mutation.isPending,
    error: mutation.error,
  };
}
