import { useEffect, useState } from 'react';
import { useContent } from '@/core/context/ContentContext';
import type { CompanyInfo } from '@/core/types';

export function useCompanyInfoEditor() {
  const { content, updateSiteSettings } = useContent();
  const [localInfo, setLocalInfo] = useState<CompanyInfo>(content.companyInfo);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalInfo(content.companyInfo);
  }, [content.companyInfo]);

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const updateInfo = <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => {
    setLocalInfo((previous) => ({ ...previous, [field]: value }));
  };

  const updateContact = <K extends keyof CompanyInfo['contact']>(
    field: K,
    value: CompanyInfo['contact'][K]
  ) => {
    setLocalInfo((previous) => ({
      ...previous,
      contact: { ...previous.contact, [field]: value },
    }));
  };

  const updateSocialMedia = <K extends keyof CompanyInfo['socialMedia']>(
    field: K,
    value: string
  ) => {
    setLocalInfo((previous) => ({
      ...previous,
      socialMedia: { ...previous.socialMedia, [field]: value || undefined },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateSiteSettings(localInfo);
      showSaved();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    localInfo,
    saved,
    handleSave,
    updateContact,
    updateInfo,
    updateSocialMedia,
  };
}
