import { Mail, Phone, MapPin } from "lucide-react";
import type { FooterContent, CompanyInfo, Language } from "@/cms/types";
import type { TranslateFn } from "@/cms/types/viewTypes";
import SocialLinksView from "../base/SocialLinksView";

interface FooterViewProps {
  footer: FooterContent;
  companyInfo: CompanyInfo;
  lang: Language;
  t: TranslateFn;
}

const themeStyles = {
  light: {
    bg: "bg-gray-900",
    text: "text-white",
    textMuted: "text-gray-400",
    border: "border-gray-800",
    link: "text-gray-400 hover:text-white",
    input: "bg-gray-800 border-gray-700 text-white",
    button: "bg-white text-gray-900 hover:bg-gray-100",
  },
};

export default function FooterView({
  footer,
  companyInfo,
  // lang,
  t,
}: FooterViewProps) {
  const style = themeStyles.light;

  return (
    <footer id="footer" className={`${style.bg} pt-16 pb-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-12">
          <div className="order-2 md:order-2 lg:order-1 lg:col-span-1">
            <h3 className={`text-2xl font-bold mb-4 ${style.text}`}>
              {t(companyInfo.name)}
            </h3>
            <p className={`mb-6 ${style.textMuted}`}>
              {t(companyInfo.description)}
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t(footer.newsletterPlaceholder)}
                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${style.input}`}
              />
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${style.button}`}
              >
                {t(footer.newsletterButton)}
              </button>
            </div>
          </div>

          <div className="order-1 md:order-1 lg:order-2 lg:col-span-2 grid grid-cols-3 gap-4 md:gap-8">
            {footer.linkGroups.map((group) => (
              <div key={group.id}>
                <h4 className={`text-lg font-semibold mb-4 ${style.text}`}>
                  {t(group.title)}
                </h4>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      {link.href === "#" ? (
                        <span className={`cursor-default ${style.link} opacity-50`}>
                          {t(link.name)}
                        </span>
                      ) : link.href.startsWith("/") ? (
                        <a
                          href={link.href}
                          className={`transition-colors ${style.link}`}
                        >
                          {t(link.name)}
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`transition-colors ${style.link}`}
                        >
                          {t(link.name)}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="order-3 md:order-2 lg:order-3 lg:col-span-1">
            <h4 className={`text-lg font-semibold mb-4 ${style.text}`}>
              {t({ zh: "联系我们", en: "Contact Us" })}
            </h4>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 ${style.textMuted}`}>
                <Phone size={20} />
                <span>{companyInfo.contact.phone}</span>
              </li>
              <li className={`flex items-center gap-3 ${style.textMuted}`}>
                <Mail size={20} />
                <span>{companyInfo.contact.email}</span>
              </li>
              <li className={`flex items-start gap-3 ${style.textMuted}`}>
                <MapPin size={20} className="mt-0.5" />
                <span>{t(companyInfo.contact.address)}</span>
              </li>
            </ul>

            <SocialLinksView socialLinks={companyInfo.socialMedia} />
          </div>
        </div>

        <div className={`border-t ${style.border} pt-8`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${style.textMuted}`}>
              &copy; 2024 {t(companyInfo.name)}.{" "}
              {t({ zh: "保留所有权利。", en: "All rights reserved." })}
            </p>
            <div className={`flex gap-6 text-sm ${style.textMuted}`}>
              <a href="#" className="hover:underline">
                {t({ zh: "隐私政策", en: "Privacy Policy" })}
              </a>
              <a href="#" className="hover:underline">
                {t({ zh: "服务条款", en: "Terms of Service" })}
              </a>
              <a href="#" className="hover:underline">
                {t({ zh: "Cookie 设置", en: "Cookie Settings" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
