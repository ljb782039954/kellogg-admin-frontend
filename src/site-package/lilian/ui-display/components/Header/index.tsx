// import { useEffect } from "react";
// import { useStore } from "@nanostores/react";
// import { $currency, $rates } from "@/cms/lib/currency";
// import { CurrencyService } from "@/core-webApp/services/currencyService";
// import { getHydrationSafeRates } from "@/cms/lib/hydrationState";
// import { createTranslate } from "../../utils/i18n";
// import { lilianSiteConfig } from "../../config";
// import type { CompanyInfo, HeaderContent, Language } from "@/cms/types";

// import HeaderView from "./HeaderView";

// export interface HeaderProps {
//     header: HeaderContent;
//     companyInfo: CompanyInfo;
//     lang: Language;
//     pathname: string;
//     initialRates?: Record<string, number> | null;
//     }

// export default function Header({
//     header,
//     companyInfo,
//     lang,
//     pathname,
//     initialRates = null,
//     }: HeaderProps) {
//     const currency = useStore($currency);
//     const rates = useStore($rates);
//     const effectiveRates = getHydrationSafeRates(rates, initialRates);
//     const t = createTranslate(lang);

//     useEffect(() => {
//         CurrencyService.initRates(initialRates);
//         CurrencyService.autoDetectCurrency();
//     }, [initialRates]);

//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text).then(() => {
//         alert(lang === "zh" ? "链接已复制到剪贴板" : "Link copied to clipboard");
//         });
//     };

//     const handleShare = () => {
//         const url = window.location.origin;
//         const title = t(companyInfo.name, lang);

//         if (navigator.share) {
//         navigator.share({ title, url }).catch(() => copyToClipboard(url));
//         return;
//         }

//         copyToClipboard(url);
//     };

//     const switchLanguage = () => {
//         const languages = lilianSiteConfig.languages;
//         const currentIndex = languages.indexOf(lang);
//         const newLang =
//         languages[(currentIndex + 1) % languages.length] ||
//         lilianSiteConfig.defaultLanguage;

//         document.cookie = `lang=${newLang};path=/;max-age=31536000`;
//         window.location.reload();
//     };

//     return (
//         <HeaderView
//         header={header}
//         companyInfo={companyInfo}
//         lang={lang}
//         pathname={pathname}
//         currency={currency}
//         rates={effectiveRates}
//         t={t}
//         onCurrencyChange={CurrencyService.switchCurrency}
//         onLanguageSwitch={switchLanguage}
//         onShare={handleShare}
//         />
//     );
//     }
