import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { invalidateEntityLists } from './cache';

export interface PaginatedEntityListKeys<Filters> {
  lists(): QueryKey;
  list(filters: Filters): QueryKey;
}

export interface EntityMutationOperation<
  Command,
  Result = unknown,
  ListResponse = unknown,
> {
  execute(command: Command): Promise<Result>;
  updateCachedLists?(
    current: ListResponse | undefined,
    result: Result,
    command: Command,
  ): ListResponse | undefined;
  invalidateLists?: boolean;
  onSuccess?(result: Result, command: Command): void | Promise<void>;
  onError?(error: Error, command: Command): void;
}

export interface PaginatedEntityListData<Model, Pagination> {
  items: Model[];
  pagination: Pagination;
}

export interface PaginatedEntityListControllerOptions<
  Model,
  Filters,
  Response,
  Pagination,
  UpdateCommand = never,
  DeleteCommand = never,
  UpdateResult = unknown,
  DeleteResult = unknown,
> {
  keys: PaginatedEntityListKeys<Filters>;
  filters: Filters;
  load(filters: Filters): Promise<Response>;
  select(response: Response): PaginatedEntityListData<Model, Pagination>;
  preservePreviousData?: boolean;
  mutations?: {
    update?: EntityMutationOperation<UpdateCommand, UpdateResult, Response>;
    remove?: EntityMutationOperation<DeleteCommand, DeleteResult, Response>;
  };
}

export function usePaginatedEntityListController<
  Model,
  Filters,
  Response,
  Pagination,
  UpdateCommand = never,
  DeleteCommand = never,
  UpdateResult = unknown,
  DeleteResult = unknown,
>({
  keys,
  filters,
  load,
  select,
  preservePreviousData,
  mutations,
}: PaginatedEntityListControllerOptions<
  Model,
  Filters,
  Response,
  Pagination,
  UpdateCommand,
  DeleteCommand,
  UpdateResult,
  DeleteResult
>) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: keys.list(filters),
    queryFn: () => load(filters),
    placeholderData: preservePreviousData ? keepPreviousData : undefined,
  });
  const selected = query.data ? select(query.data) : undefined;
  const updateMutation = useMutation({
    mutationFn: async (command: UpdateCommand) => {
      if (!mutations?.update) {
        throw new Error('Entity update operation is not configured');
      }
      return mutations.update.execute(command);
    },
    onSuccess: async (result, command) => {
      if (mutations?.update?.updateCachedLists) {
        queryClient.setQueriesData<Response>(
          { queryKey: keys.lists() },
          (current) =>
            mutations.update!.updateCachedLists!(current, result, command),
        );
      }
      if (mutations?.update?.invalidateLists !== false) {
        await invalidateEntityLists(queryClient, keys);
      }
      await mutations?.update?.onSuccess?.(result, command);
    },
    onError: (error, command) => {
      mutations?.update?.onError?.(error, command);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (command: DeleteCommand) => {
      if (!mutations?.remove) {
        throw new Error('Entity remove operation is not configured');
      }
      return mutations.remove.execute(command);
    },
    onSuccess: async (result, command) => {
      if (mutations?.remove?.updateCachedLists) {
        queryClient.setQueriesData<Response>(
          { queryKey: keys.lists() },
          (current) =>
            mutations.remove!.updateCachedLists!(current, result, command),
        );
      }
      if (mutations?.remove?.invalidateLists !== false) {
        await invalidateEntityLists(queryClient, keys);
      }
      await mutations?.remove?.onSuccess?.(result, command);
    },
    onError: (error, command) => {
      mutations?.remove?.onError?.(error, command);
    },
  });

  return {
    items: selected?.items ?? [],
    pagination: selected?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    retry: query.refetch,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isRemoving: deleteMutation.isPending,
    mutationError: updateMutation.error ?? deleteMutation.error,
  };
}
