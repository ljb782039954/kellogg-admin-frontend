import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getCompanyInfo, saveCompanyInfo } from '../api/companyInfo.api';
import { companyInfoKeys } from '../api/companyInfo.keys';
import { blankCompanyInfo } from './companyInfo.defaults';
import {
  companyInfoSchema,
  toCompanyInfoFormValues,
  toCompanyInfoPayload,
  type CompanyInfoFormValues,
} from './companyInfo.mapper';

export function useCompanyInfoForm() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: blankCompanyInfo,
  });
  const { formState, reset } = form;

  const query = useQuery({
    queryKey: companyInfoKeys.detail(),
    queryFn: getCompanyInfo,
  });

  const mutation = useMutation({
    mutationFn: saveCompanyInfo,
    onSuccess: async (_result, payload) => {
      queryClient.setQueryData(companyInfoKeys.detail(), payload);
      reset(toCompanyInfoFormValues(payload));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    },
  });

  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset(toCompanyInfoFormValues(query.data));
    }
  }, [formState.isDirty, query.data, reset]);

  const submit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(toCompanyInfoPayload(values));
  });

  return {
    form,
    submit,
    saved,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    queryError: query.error,
    mutationError: mutation.error,
    retry: query.refetch,
  };
}
