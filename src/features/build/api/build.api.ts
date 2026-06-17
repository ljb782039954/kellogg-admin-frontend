import { apiClient } from '@/shared/api/client';

interface BuildStatus {
  hasChanges: boolean;
  lastBuildTime?: string;
}

interface BuildResponse {
  success: boolean;
  buildStatus: BuildStatus;
}

export function getBuildStatus(): Promise<BuildStatus> {
  return apiClient.request<BuildStatus | null>('/api/config/build_status').catch((err) => {
    if (err.status === 404) return { hasChanges: false };
    throw err;
  });
}

export function triggerBuild(): Promise<BuildResponse> {
  return apiClient.request<BuildResponse>('/api/system/trigger-build', {
    method: 'POST',
  });
}

export type { BuildStatus };
