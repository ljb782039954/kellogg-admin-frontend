import type { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Phone, Globe, Building2, Package } from 'lucide-react';
// import TurnstileWidget from '@/runtime/components/TurnstileWidget';
import type { Language } from '@/cms/types';

export interface InquiryFormValues {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

export interface InquiryFormText {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  productType: string;
  quantity: string;
  message: string;
  submit: string;
  success: string;
  successMsg: string;
  back: string;
  placeholders: {
    name: string;
    email: string;
    phone: string;
    country: string;
    company: string;
    productType: string;
    quantity: string;
    message: string;
  };
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
  // turnstileResetKey,
  // turnstileLang = 'en',
  // turnstileSiteKey,
  // useTurnstileTestSiteKey,
  onValuesChange,
  // onTurnstileTokenChange,
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">{text.success}</h2>
          <p className="text-gray-500">{text.successMsg}</p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-900 font-bold border-b-2 border-gray-900 hover:text-black hover:border-black transition-colors"
        >
          {text.back}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            {text.name} *
          </label>
          <input
            required
            type="text"
            placeholder={text.placeholders.name}
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            {text.email} *
          </label>
          <input
            required
            type="email"
            placeholder={text.placeholders.email}
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {text.phone}
          </label>
          <input
            type="tel"
            placeholder={text.placeholders.phone}
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {text.country}
          </label>
          <input
            type="text"
            placeholder={text.placeholders.country}
            value={values.country}
            onChange={(event) => updateField('country', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
          <Building2 className="w-3 h-3" /> {text.company}
        </label>
        <input
          type="text"
          placeholder={text.placeholders.company}
          value={values.company}
          onChange={(event) => updateField('company', event.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
            <Package className="w-3 h-3" /> {text.productType}
          </label>
          <input
            type="text"
            placeholder={text.placeholders.productType}
            value={values.product_type}
            onChange={(event) => updateField('product_type', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            {text.quantity}
          </label>
          <input
            type="text"
            placeholder={text.placeholders.quantity}
            value={values.quantity}
            onChange={(event) => updateField('quantity', event.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
          {text.message} *
        </label>
        <textarea
          required
          placeholder={text.placeholders.message}
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm min-h-[140px] outline-none"
        />
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
        type="submit"
        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-gray-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
        {text.submit}
      </button>
    </form>
  );
}
