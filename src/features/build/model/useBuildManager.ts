import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { toAppError } from '@/shared/api/errors';
import { getBuildStatus, triggerBuild } from '../api/build.api';
import { buildKeys } from '../api/build.keys';

export function useBuildManager() {
  const queryClient = useQueryClient();

  const { data: buildStatus = { hasChanges: false } } = useQuery({
    queryKey: buildKeys.status(),
    queryFn: getBuildStatus,
    refetchInterval: 30_000,
  });

  const triggerMutation = useMutation({
    mutationFn: triggerBuild,
    onSuccess: (response) => {
      if (response.success && response.buildStatus) {
        queryClient.setQueryData(buildKeys.status(), response.buildStatus);
      }
    },
  });

  return {
    buildStatus,
    isBuilding: triggerMutation.isPending,
    error: triggerMutation.error ? toAppError(triggerMutation.error).message : null,
    hasChanges: buildStatus.hasChanges,
    lastBuildTime: buildStatus.lastBuildTime,
    triggerMutation,
  };
}
