import { CloudLightning } from 'lucide-react';

interface BuildTriggerProps {
  hasChanges: boolean;
  isBuilding: boolean;
  lastBuildTime?: string;
  onBuild: () => void;
}

export function BuildTrigger({ hasChanges, isBuilding, lastBuildTime, onBuild }: BuildTriggerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">发布构建</span>
        {hasChanges ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          如果内容有改动，请点击重新部署。
        </p>
      </div>

      <button
        onClick={onBuild}
        disabled={isBuilding}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
          hasChanges
            ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-100'
            : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <CloudLightning className={`w-4 h-4 ${isBuilding ? 'animate-bounce' : ''}`} />
        <span>{isBuilding ? '部署中...' : hasChanges ? '立即部署更新' : '重新构建网站'}</span>
      </button>

      {lastBuildTime && (
        <p className="text-[12px] text-gray-600 text-center">
          上次部署: {new Date(lastBuildTime).toLocaleString('zh-CN', {
            hour12: false,
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
