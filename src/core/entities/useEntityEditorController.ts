import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EntityCacheKeys } from './cache';
import {
  invalidateEntityDetail,
  invalidateEntityLists,
  setEntityDetail,
} from './cache';

export interface EntityEditorOperations<Model, Id, SaveCommand, SaveResult> {
  load(id: Id): Promise<Model>;
  create(command: SaveCommand): Promise<SaveResult>;
  update(id: Id, command: SaveCommand): Promise<SaveResult>;
}

export interface EntityEditorControllerOptions<
  Model,
  Id,
  SaveCommand,
  SaveResult = Id,
> {
  id: Id | undefined;
  enabled: boolean;
  keys: EntityCacheKeys<Id>;
  operations: EntityEditorOperations<Model, Id, SaveCommand, SaveResult>;
  resolveSavedId?(result: SaveResult, currentId: Id | undefined): Id;
  selectSavedModel?(result: SaveResult): Model | undefined;
  onSaved?(id: Id, result: SaveResult): void | Promise<void>;
  onError?(error: Error): void;
}

export function useEntityEditorController<
  Model,
  Id,
  SaveCommand,
  SaveResult = Id,
>({
  id,
  enabled,
  keys,
  operations,
  resolveSavedId,
  selectSavedModel,
  onSaved,
  onError,
}: EntityEditorControllerOptions<Model, Id, SaveCommand, SaveResult>) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: keys.detail(id as Id),
    queryFn: () => operations.load(id as Id),
    enabled,
  });

  const saveMutation = useMutation({
    mutationFn: async (
      command: SaveCommand,
    ): Promise<{ id: Id; result: SaveResult }> => {
      let result: SaveResult;
      if (enabled && id !== undefined) {
        result = await operations.update(id, command);
      } else {
        result = await operations.create(command);
      }
      const savedId = resolveSavedId
        ? resolveSavedId(result, id)
        : id !== undefined
          ? id
          : result as unknown as Id;
      return { id: savedId, result };
    },
    onSuccess: async ({ id: savedId, result }) => {
      await invalidateEntityLists(queryClient, keys);
      const savedModel = selectSavedModel?.(result);
      if (savedModel !== undefined) {
        setEntityDetail(queryClient, keys, savedId, savedModel);
      } else {
        await invalidateEntityDetail(queryClient, keys, savedId);
      }
      await onSaved?.(savedId, result);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    model: query.data,
    isEdit: enabled,
    isLoading: query.isLoading,
    fetchError: query.error,
    retry: query.refetch,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}
