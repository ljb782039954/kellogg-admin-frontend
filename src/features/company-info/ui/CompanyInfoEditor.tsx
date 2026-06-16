import { toAppError } from '@/shared/api/errors';
import { useCompanyInfoForm } from '../model/useCompanyInfoForm';
import { CompanyInfoFormView } from './CompanyInfoFormView';

export function CompanyInfoEditor() {
  const {
    form,
    submit,
    saved,
    isLoading,
    isSaving,
    queryError,
    mutationError,
    retry,
  } = useCompanyInfoForm();

  if (isLoading) {
    return <div className="text-gray-500">正在加载公司信息...</div>;
  }

  if (queryError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {toAppError(queryError).message}
        </div>
        <button className="text-sm underline" type="button" onClick={() => retry()}>
          重试
        </button>
      </div>
    );
  }

  return (
    <CompanyInfoFormView
      form={form}
      onSubmit={submit}
      saved={saved}
      isSaving={isSaving}
      errorMessage={mutationError ? toAppError(mutationError).message : undefined}
    />
  );
}
