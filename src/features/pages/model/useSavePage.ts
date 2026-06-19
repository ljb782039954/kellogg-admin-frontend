import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CustomPage } from '@/types';
import { savePageDetail, savePagesIndex } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { sanitizePageIndex } from './pages.mapper';

export function useSavePage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (page: CustomPage) => {
      await savePageDetail(page.id, page);

      const currentIndex = queryClient.getQueryData<CustomPage[]>(pageKeys.list()) ?? [];
      const nextIndex = currentIndex.map((entry) =>
        entry.id === page.id ? page : entry,
      );
      await savePagesIndex(sanitizePageIndex(nextIndex) as unknown as Record<string, unknown>[]);

      return page;
    },
    onSuccess: (page) => {
      queryClient.setQueryData(pageKeys.detail(page.id), page);
      queryClient.invalidateQueries({ queryKey: pageKeys.list() });
    },
  });

  return {
    savePage: mutation.mutateAsync,
    isSaving: mutation.isPending,
    error: mutation.error,
  };
}
