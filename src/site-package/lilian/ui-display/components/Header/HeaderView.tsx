import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Coins, Globe2, Menu, Share2, X } from "lucide-react";
import type { CompanyInfo, HeaderContent, Language } from "@/cms/types";
import type { TranslateFn } from "@/cms/types/viewTypes";
import OptimizedImage from "@/runtime/components/OptimizedImage";

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
}: HeaderViewProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleMobileItem = (id: string) => {
    setExpandedItems((items) => ({ ...items, [id]: !items[id] }));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-glass backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="/" className="flex items-center gap-3">
          {companyInfo.logo && (
              <OptimizedImage
                src={companyInfo.logo}
                alt="Logo"
                width={120}
                className="w-12  md:w-16 lg:w-18 object-contain"
              />
            )}
          {/* <span className="font-luxury-heading text-xl tracking-[0.18em] text-ink-strong">
            {t(companyInfo.name)}
          </span> */}
        </a>

        <nav className="hidden h-full items-center gap-8 md:flex">
          {header.navItems.map((item) => {
            const hasDropdown = item.children && item.children.length > 0;
            const isActive =
              pathname === item.href ||
              Boolean(item.children?.some((child) => child.href === pathname));

            return (
              <div
                key={item.id}
                className="relative flex h-full items-center"
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a
                  href={item.href || "#"}
                  className={`flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                    isActive ? "text-ink-strong" : "text-body hover:text-ink-strong"
                  }`}
                >
                  {t(item.name)}
                  {hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </a>

                {hasDropdown && activeMenu === item.id && (
                  <div className="absolute left-1/2 top-full w-52 -translate-x-1/2 pt-3">
                    <div className="border border-border bg-surface p-2 shadow-xl">
                      {item.children!.map((child) => (
                        <a
                          key={child.id}
                          href={child.href}
                          className="block px-4 py-3 text-xs text-body transition-colors hover:bg-page hover:text-ink-strong"
                        >
                          {t(child.name)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden h-9 items-center gap-1 rounded-full border border-border px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-body transition-colors hover:border-ink-strong hover:text-ink-strong sm:flex">
            <Coins className="h-4 w-4" />
            <select
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value)}
              className="cursor-pointer appearance-none bg-transparent outline-none"
            >
              {(rates ? Object.keys(rates) : ["USD", "CNY"]).map((item) => (
                <option key={item} value={item} className="bg-surface text-ink-strong">
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onLanguageSwitch}
            className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-body transition-colors hover:border-ink-strong hover:text-ink-strong"
          >
            <Globe2 className="h-4 w-4" />
            {lang === "zh" ? "ZH" : "EN"}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-ink-strong text-on-dark transition-colors hover:bg-ink sm:flex"
            title={lang === "zh" ? "分享" : "Share"}
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-strong md:hidden"
            title={lang === "zh" ? "菜单" : "Menu"}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-surface px-5 py-4 md:hidden">
          <nav className="flex flex-col">
            {header.navItems.map((item) => {
              const hasDropdown = item.children && item.children.length > 0;
              const isExpanded = expandedItems[item.id] || false;
              const targetHref = item.href || "#";

              return (
                <div key={item.id} className="border-b border-border py-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-4">
                    <a
                      href={hasDropdown ? "#" : targetHref}
                      onClick={(event) => {
                        if (!hasDropdown) {
                          setIsMenuOpen(false);
                          return;
                        }

                        event.preventDefault();
                        toggleMobileItem(item.id);
                      }}
                      className="font-luxury-heading text-xl text-ink-strong"
                    >
                      {t(item.name)}
                    </a>
                    {hasDropdown && (
                      <button
                        type="button"
                        onClick={() => toggleMobileItem(item.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-strong transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        title={isExpanded ? (lang === "zh" ? "收起" : "Collapse") : (lang === "zh" ? "展开" : "Expand")}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {hasDropdown && (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex flex-col gap-2 border-l border-border pl-4">
                            {item.children!.map((child) => (
                              <a
                                key={child.id}
                                href={child.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-sm transition-colors ${
                                  pathname === child.href ? "text-ink-strong" : "text-body hover:text-ink-strong"
                                }`}
                              >
                                {t(child.name)}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <div className="flex flex-1 items-center justify-center gap-2 border border-border px-3 py-3 text-xs font-medium text-body">
              <Coins className="h-4 w-4" />
              <select
                value={currency}
                onChange={(event) => onCurrencyChange(event.target.value)}
                className="cursor-pointer appearance-none bg-transparent outline-none"
              >
                {(rates ? Object.keys(rates) : ["USD", "CNY"]).map((item) => (
                  <option key={item} value={item} className="bg-surface text-ink-strong">
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onShare}
              className="flex h-11 w-11 items-center justify-center border border-border text-ink-strong"
              title={lang === "zh" ? "分享" : "Share"}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
