import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { InquiriesManager } from './inbox/InquiriesManager';
import { InquirySettingsEditor } from './settings/InquirySettingsEditor';

export { InquiriesManager } from './inbox/InquiriesManager';
export { InquiriesView } from './inbox/InquiriesView';
export { InquirySettingsEditor } from './settings/InquirySettingsEditor';
export { InquirySettingsView } from './settings/InquirySettingsView';

export const InquiriesScreen: ComponentType<AdminScreenProps> =
  function InquiriesScreen() {
    return <InquiriesManager />;
  };

export const InquirySettingsScreen: ComponentType<AdminScreenProps> =
  function InquirySettingsScreen() {
    return <InquirySettingsEditor />;
  };
