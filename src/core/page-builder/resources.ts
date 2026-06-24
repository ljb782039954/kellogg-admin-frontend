export interface PageBuilderResourceInput<Data> {
  data: Data;
  isLoading: boolean;
  error: unknown;
}

export interface PageBuilderResourceState<Resources> {
  resources: Resources;
  isLoading: boolean;
  error: string | null;
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return error == null ? null : '资源加载失败';
}

export function combinePageBuilderResources<
  Inputs extends readonly PageBuilderResourceInput<unknown>[],
  Resources,
>(
  inputs: Inputs,
  selectResources: (inputs: Inputs) => Resources,
): PageBuilderResourceState<Resources> {
  return {
    resources: selectResources(inputs),
    isLoading: inputs.some((input) => input.isLoading),
    error:
      inputs
        .map((input) => getErrorMessage(input.error))
        .find((message) => message !== null) ?? null,
  };
}
