import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  EntityDetailCacheKeys,
  EntityListCacheKeys,
} from './cache';
import { invalidateEntityLists } from './cache';

export interface EntityCollectionOperations<
  Model,
  CreateCommand,
  UpdateCommand,
  DeleteCommand,
> {
  load(): Promise<Model[]>;
  create(command: CreateCommand): Promise<unknown>;
  update(command: UpdateCommand): Promise<unknown>;
  remove(command: DeleteCommand): Promise<unknown>;
}

export interface EntityCollectionControllerOptions<
  Model,
  Id,
  CreateCommand,
  UpdateCommand,
  DeleteCommand,
> {
  keys: EntityListCacheKeys & Partial<EntityDetailCacheKeys<Id>>;
  operations: EntityCollectionOperations<
    Model,
    CreateCommand,
    UpdateCommand,
    DeleteCommand
  >;
}

export function useEntityCollectionController<
  Model,
  Id,
  CreateCommand,
  UpdateCommand,
  DeleteCommand,
>({
  keys,
  operations,
}: EntityCollectionControllerOptions<
  Model,
  Id,
  CreateCommand,
  UpdateCommand,
  DeleteCommand
>) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: keys.lists(),
    queryFn: operations.load,
  });

  const invalidate = () => invalidateEntityLists(queryClient, keys);

  const createMutation = useMutation({
    mutationFn: (command: CreateCommand) => operations.create(command),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: (command: UpdateCommand) => operations.update(command),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (command: DeleteCommand) => operations.remove(command),
    onSuccess: invalidate,
  });

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    queryError: query.error,
    mutationError,
    error: mutationError?.message ?? query.error?.message ?? null,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createCommand: createMutation.variables,
    updateCommand: updateMutation.variables,
    deleteCommand: deleteMutation.variables,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    retry: query.refetch,
  };
}
