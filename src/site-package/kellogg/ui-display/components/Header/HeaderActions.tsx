import { Globe, Share2, Menu, X, Coins } from "lucide-react";
import type { Language } from "@/cms/types";

interface HeaderActionsProps {
  currency: string;
  rates: Record<string, number> | null;
  lang: Language;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onCurrencyChange: (currency: string) => void;
  onLanguageSwitch: () => void;
  onShare: () => void;
  textStyle: string;
  borderStyle: string;
}

export default function HeaderActions({
  currency,
  rates,
  lang,
  isMobileMenuOpen,
  onMobileMenuToggle,
  onCurrencyChange,
  onLanguageSwitch,
  onShare,
  textStyle,
  borderStyle,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${textStyle} border ${borderStyle}`}>
        <Coins className="w-4 h-4" />
        <select
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value)}
          className="bg-transparent appearance-none border-none outline-none cursor-pointer px-1"
        >
          {(rates ? Object.keys(rates) : ["USD", "CNY"]).map((item) => (
            <option key={item} value={item} className="text-gray-900 bg-white">
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onLanguageSwitch}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${textStyle} border ${borderStyle}`}
      >
        <Globe className="w-4 h-4" />
        {lang === "zh" ? "中文" : "EN"}
      </button>

      <button
        onClick={onShare}
        className={`p-2 rounded-full ${textStyle} border ${borderStyle}`}
      >
        <Share2 className="w-4 h-4" />
      </button>

      <button onClick={onMobileMenuToggle} className={`md:hidden p-2 ${textStyle}`}>
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
