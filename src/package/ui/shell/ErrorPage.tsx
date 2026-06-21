export function ErrorPage({ error }: { error?: unknown }) {
  const message = error instanceof Error ? error.message : '发生未知错误';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-800">出错了</h1>
      <p className="text-sm">{message}</p>
    </div>
  );
}
