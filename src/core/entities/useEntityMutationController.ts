import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { EntityCacheKeys } from './cache';
import {
  invalidateEntityDetail,
  invalidateEntityLists,
  setEntityDetail,
} from './cache';

export interface EntityMutationControllerOptions<
  Command,
  Result,
  Id,
  Model,
> {
  keys: EntityCacheKeys<Id>;
  execute(command: Command): Promise<Result>;
  resolveId(result: Result, command: Command): Id;
  selectModel?(result: Result, command: Command): Model | undefined;
  invalidateLists?: boolean;
  invalidateDetail?: boolean;
  onSuccess?(result: Result, command: Command): void | Promise<void>;
  onError?(error: Error): void;
}

export function useEntityMutationController<
  Command,
  Result,
  Id,
  Model = never,
>({
  keys,
  execute,
  resolveId,
  selectModel,
  invalidateLists = true,
  invalidateDetail = true,
  onSuccess,
  onError,
}: EntityMutationControllerOptions<Command, Result, Id, Model>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: execute,
    onSuccess: async (result, command) => {
      const id = resolveId(result, command);
      const model = selectModel?.(result, command);

      if (model !== undefined) {
        setEntityDetail(queryClient, keys, id, model);
      } else if (invalidateDetail) {
        await invalidateEntityDetail(queryClient, keys, id);
      }
      if (invalidateLists) {
        await invalidateEntityLists(queryClient, keys);
      }
      await onSuccess?.(result, command);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
