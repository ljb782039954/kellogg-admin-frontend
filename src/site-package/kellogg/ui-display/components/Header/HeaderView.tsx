import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import type { CompanyInfo, HeaderContent, Language } from "@/cms/types";
import type { TranslateFn } from "@/cms/types/viewTypes";
import OptimizedImage from "@/runtime/components/OptimizedImage";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import HeaderActions from "./HeaderActions";

interface HeaderViewProps {
  header: HeaderContent;
  companyInfo: CompanyInfo;
  lang: Language;
  pathname: string;
  currency: string;
  rates: Record<string, number> | null;
  t: TranslateFn;
  onCurrencyChange: (currency: string) => void;
  onLanguageSwitch: () => void;
  onShare: () => void;
}

export default function HeaderView({
  header,
  companyInfo,
  lang,
  pathname,
  currency,
  rates,
  t,
  onCurrencyChange,
  onLanguageSwitch,
  onShare,
  // LogoImage = DefaultLogoImage,
}: HeaderViewProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const style = {
    bg: "bg-white/95 backdrop-blur-md shadow-sm",
    text: "text-gray-800",
    border: "border-gray-100",
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${style.bg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          <a href="/" className="flex items-center gap-2">
            {companyInfo.logo && (
              <OptimizedImage
                src={companyInfo.logo}
                alt="Logo"
                width={80}
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
            )}
            <span className={`text-base md:text-lg lg:text-xl font-bold tracking-wider ${style.text}`}>
              {t(companyInfo.name, lang)}
            </span>
          </a>

          <div className="hidden md:block h-full">
            <DesktopNav
              navItems={header.navItems}
              lang={lang}
              pathname={pathname}
              textStyle={style.text}
              t={t}
            />
          </div>

          <HeaderActions
            currency={currency}
            rates={rates}
            lang={lang}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            onCurrencyChange={onCurrencyChange}
            onLanguageSwitch={onLanguageSwitch}
            onShare={onShare}
            textStyle={style.text}
            borderStyle={style.border}
          />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className={`md:hidden ${style.bg} border-t ${style.border} overflow-hidden max-h-[80vh] overflow-y-auto`}>
            <MobileNav
              navItems={header.navItems}
              lang={lang}
              pathname={pathname}
              onNavigate={() => setIsMobileMenuOpen(false)}
              textStyle={style.text}
              t={t}
            />

            <div className="container mx-auto px-4 pb-6">
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl ${style.text} border ${style.border}`}>
                  <Coins className="w-5 h-5" />
                  <select
                    value={currency}
                    onChange={(event) => onCurrencyChange(event.target.value)}
                    className="bg-transparent appearance-none border-none outline-none cursor-pointer font-bold"
                  >
                    {(rates ? Object.keys(rates) : ["USD", "CNY"]).map((item) => (
                      <option key={item} value={item} className="text-gray-900 bg-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
