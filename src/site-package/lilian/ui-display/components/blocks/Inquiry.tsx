import type { FormEventHandler } from "react";
import { Mail, Package, Send } from "lucide-react";
import RichText from "@/runtime/components/RichText";

export interface InquiryFormValues {
  name: string;
  email: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

export interface InquiryFormText {
  name: string;
  email: string;
  company: string;
  productType: string;
  quantity: string;
  message: string;
  submit: string;
  placeholders: InquiryFormValues;
}

export interface InquiryProps {
  titleText?: string;
  subtitleText?: string;
  values: InquiryFormValues;
  text: InquiryFormText;
  onValuesChange: (values: InquiryFormValues) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function Inquiry({
  titleText = "",
  subtitleText = "",
  values,
  text,
  onValuesChange,
  onSubmit,
}: InquiryProps) {
  const updateField = <K extends keyof InquiryFormValues>(field: K, value: InquiryFormValues[K]) => {
    onValuesChange({ ...values, [field]: value });
  };

  return (
    <section className="px-6 py-12 bg-ink-strong text-on-dark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div>
          <div className="w-12 h-12 border border-on-dark-border flex items-center justify-center mb-6">
            <Mail className="w-5 h-5" />
          </div>
          {titleText && <h2 className="font-luxury-heading text-3xl md:text-5xl font-light leading-tight">{titleText}</h2>}
          {subtitleText && <RichText value={subtitleText} className="mt-5 text-sm md:text-base leading-7 text-on-dark-soft" />}
        </div>

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
              <span className="text-xs uppercase text-subtle">{text.company}</span>
              <input
                value={values.company}
                placeholder={text.placeholders.company}
                onChange={(event) => updateField("company", event.target.value)}
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

          <button type="submit" className="mt-6 w-full bg-ink-strong rounded text-on-dark py-4 text-sm uppercase flex items-center justify-center gap-3">
            <Send className="w-4 h-4" />
            {text.submit}
          </button>
        </form>
      </div>
    </section>
  );
}



