import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavLink, Language } from "@/cms/types";
import type { TranslateFn } from "@/cms/types/viewTypes";

interface MobileNavProps {
  navItems: NavLink[];
  lang: Language;
  pathname: string;
  onNavigate: () => void;
  textStyle: string;
  t: TranslateFn;
}

export default function MobileNav({
  navItems,
  lang,
  pathname,
  onNavigate,
  textStyle,
  t,
}: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
      {navItems.map((item) => {
        const isSingleLink = item.children && item.children.length === 1;
        const hasDropdown = item.children && item.children.length > 1;
        const targetHref = isSingleLink ? item.children![0].href : item.href || "#";
        const itemId = item.id || targetHref;
        const isExpanded = expandedItems[itemId] || false;

        return (
          <div key={itemId} className="flex flex-col border-b border-gray-100/10 pb-2 mb-2">
            <div className="flex items-center justify-between">
              <a
                href={hasDropdown ? "#" : targetHref}
                onClick={(event) => {
                  if (hasDropdown) {
                    event.preventDefault();
                    toggleExpand(itemId);
                    return;
                  }

                  onNavigate();
                }}
                className={`flex-1 text-lg font-bold py-2 ${textStyle} ${
                  pathname === targetHref ? "opacity-100" : "opacity-70"
                }`}
              >
                {t(item.name, lang)}
              </a>
              {hasDropdown && (
                <button
                  onClick={() => toggleExpand(itemId)}
                  className={`p-2 ${textStyle} opacity-70 hover:opacity-100 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            {hasDropdown && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pl-4 pt-2 pb-2 border-l-2 border-white/20 mt-1 ml-2">
                      {item.children!.map((child) => (
                        <a
                          key={child.id || child.href}
                          href={child.href}
                          onClick={() => onNavigate()}
                          className={`text-base py-2 ${textStyle} ${
                            pathname === child.href ? "opacity-100 font-bold" : "opacity-60"
                          }`}
                        >
                          {t(child.name, lang)}
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
  );
}
