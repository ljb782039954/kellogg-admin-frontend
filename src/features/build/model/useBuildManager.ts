import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBuildStatus, triggerBuild } from '../api/build.api';
import { buildKeys } from '../api/build.keys';

export function useBuildManager() {
  const queryClient = useQueryClient();
  const [isBuilding, setIsBuilding] = useState(false);

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
        toast.success('构建部署已成功触发，正在后台生成中...');
      } else {
        toast.error('触发构建失败');
      }
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(`触发构建出错: ${e.message || e}`);
    },
  });

  const handleBuild = useCallback(async () => {
    setIsBuilding(true);
    try {
      await triggerMutation.mutateAsync();
    } finally {
      setIsBuilding(false);
    }
  }, [triggerMutation]);

  return {
    buildStatus,
    isBuilding,
    hasChanges: buildStatus.hasChanges,
    lastBuildTime: buildStatus.lastBuildTime,
    handleBuild,
  };
}
