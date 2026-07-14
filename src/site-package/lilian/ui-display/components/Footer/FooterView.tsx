import { Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import type { CompanyInfo, FooterContent, Language } from "@/cms/types";
import type { TranslateFn } from "@/cms/types/viewTypes";

interface FooterViewProps {
  footer: FooterContent;
  companyInfo: CompanyInfo;
  lang: Language;
  t: TranslateFn;
}

export default function FooterView({ footer, companyInfo, lang, t }: FooterViewProps) {
  return (
    <footer className="bg-ink-strong text-on-dark">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1fr]">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-on-dark-faint">
              {lang === "zh" ? "慢奢衣橱" : "Quiet Luxury Wardrobe"}
            </p>
            <h2 className="font-luxury-heading text-4xl tracking-wide md:text-5xl">
              {t(companyInfo.name)}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-on-dark-soft">
              {t(companyInfo.description)}
            </p>

            <div className="mt-8 flex max-w-md border border-on-dark-border bg-on-dark-wash p-1">
              <input
                type="email"
                placeholder={t(footer.newsletterPlaceholder)}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-on-dark outline-none placeholder:text-on-dark-faint"
              />
              <button
                type="button"
                className="flex items-center gap-2 bg-on-dark px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-strong transition-colors hover:bg-soft"
              >
                <Send className="h-3.5 w-3.5" />
                {t(footer.newsletterButton)}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {footer.linkGroups.map((group) => (
              <div key={group.id}>
                <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-dark">
                  {t(group.title)}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="text-sm text-on-dark-soft transition-colors hover:text-on-dark"
                      >
                        {t(link.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-dark">
              {lang === "zh" ? "联系" : "Contact"}
            </h3>
            <ul className="space-y-4 text-sm text-on-dark-soft">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brand" />
                <span>{companyInfo.contact.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand" />
                <span>{companyInfo.contact.email}</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand" />
                <span>{t(companyInfo.contact.address)}</span>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              {companyInfo.socialMedia.instagram && (
                <a
                  href={companyInfo.socialMedia.instagram}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-on-dark-border text-on-dark-soft transition-colors hover:border-brand hover:text-on-dark"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {companyInfo.socialMedia.youtube && (
                <a
                  href={companyInfo.socialMedia.youtube}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-on-dark-border text-on-dark-soft transition-colors hover:border-brand hover:text-on-dark"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-on-dark-border pt-8 text-xs text-on-dark-faint md:flex-row md:items-center md:justify-between">
          <p>
            &copy; 2026 {t(companyInfo.name)}. {lang === "zh" ? "保留所有权利。" : "All rights reserved."}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-on-dark">
              {lang === "zh" ? "隐私政策" : "Privacy"}
            </a>
            <a href="#" className="hover:text-on-dark">
              {lang === "zh" ? "服务条款" : "Terms"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
