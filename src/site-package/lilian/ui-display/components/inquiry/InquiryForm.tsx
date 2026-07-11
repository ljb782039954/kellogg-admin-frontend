import type { FormEventHandler } from 'react';
// import { motion } from 'framer-motion';
import { Send, Loader2, Package } from 'lucide-react';
// import TurnstileWidget from '@/runtime/components/TurnstileWidget';
import type { Language } from '@/cms/types';

export interface InquiryFormValues {
  name: string;
  email: string;
  country?: string;
  product_type: string;
  quantity: string;
  message: string;
}

export interface InquiryFormText {
  name: string;
  email: string;
  country?: string;
  productType: string;
  quantity: string;
  message: string;
  submit: string;
  success: string;
  successMsg: string;
  back: string;
  placeholders: InquiryFormValues;
}

export interface InquiryFormProps {
  values: InquiryFormValues;
  text: InquiryFormText;
  isSubmitting: boolean;
  isSuccess: boolean;
  turnstileResetKey?: number;
  turnstileLang?: Language;
  turnstileSiteKey?: string;
  useTurnstileTestSiteKey?: boolean;
  onValuesChange: (values: InquiryFormValues) => void;
  onTurnstileTokenChange: (token: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: () => void;
}

export default function InquiryForm({
  values,
  text,
  isSubmitting,
  isSuccess,
  turnstileResetKey,
  turnstileLang = 'en',
  turnstileSiteKey,
  useTurnstileTestSiteKey,
  onValuesChange,
  onTurnstileTokenChange,
  onSubmit,
  onBack,
}: InquiryFormProps) {
  const updateField = <K extends keyof InquiryFormValues>(
    field: K,
    value: InquiryFormValues[K]
  ) => {
    onValuesChange({ ...values, [field]: value });
  };

  if (isSuccess) {
    return (
      <section className="px-6 py-12 bg-ink-strong text-on-dark">
        <div className="max-w-3xl mx-auto bg-surface text-ink-strong rounded-md p-8 text-center">
          <h2 className="font-luxury-heading text-3xl font-light">{text.success || "Success!"}</h2>
          {text.successMsg && <p className="mt-4 text-sm text-body">{text.successMsg}</p>}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-6 rounded bg-ink-strong px-6 py-3 text-sm uppercase text-on-dark"
            >
              {text.back || "Back"}
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
        <form onSubmit={onSubmit} className="bg-surface text-ink-strong rounded-md p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-xs uppercase text-subtle">{text.name}</span>
              <input
                required
                value={values.name}
                placeholder={text.placeholders.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-2 w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase text-subtle">{text.email}</span>
              <input
                required
                type="email"
                value={values.email}
                placeholder={text.placeholders.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-2 w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase text-subtle">{text.country}</span>
              <input
                value={values.country || ''}
                placeholder={text.placeholders.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="mt-2 w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase text-subtle">{text.productType}</span>
              <input
                value={values.product_type}
                placeholder={text.placeholders.product_type}
                onChange={(event) => updateField("product_type", event.target.value)}
                className="mt-2 w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs uppercase text-subtle flex items-center gap-2">
                <Package className="w-3 h-3" />
                {text.quantity}
              </span>
              <input
                value={values.quantity}
                placeholder={text.placeholders.quantity}
                onChange={(event) => updateField("quantity", event.target.value)}
                className="mt-2 w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs uppercase text-subtle">{text.message}</span>
              <textarea
                required
                value={values.message}
                placeholder={text.placeholders.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="mt-2 min-h-[132px] w-full rounded border border-border px-4 py-3 text-sm outline-none focus:border-ink-strong"
              />
            </label>
          </div>

          {/* <TurnstileWidget
            lang={turnstileLang}
            siteKey={turnstileSiteKey}
            useTestSiteKey={useTurnstileTestSiteKey}
            onTokenChange={onTurnstileTokenChange}
            resetKey={turnstileResetKey}
          /> */}

          <button 
          disabled={isSubmitting}
          type="submit" className="mt-6 w-full bg-ink-strong rounded text-on-dark py-4 text-sm uppercase flex items-center justify-center gap-3">
        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
            {text.submit}
          </button>
        </form>
  );
}
