import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface TableColumn {
  id: string;
  label: Translation;
}

export interface TableRow {
  id: string;
  cells: Record<string, Translation>;
}

export interface TableContent {
  title?: Translation;
  subtitle?: Translation;
  columns: TableColumn[];
  rows: TableRow[];
  showHeader?: boolean;
  striped?: boolean;
  textAlign?: "left" | "center";
}

export interface TableProps {
  content: TableContent;
  lang: Language;
}

export default function Table({ content, lang = "en" }: TableProps) {
  if (!content) return null;

  const translate = createTranslate(lang);
  const { columns, rows, showHeader = true, striped = false, textAlign = "left" } = content;
  const textAlignClass = textAlign === "center" ? "text-center" : "text-left";

  return (
    <section className="bg-[#faf9f7] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        {(content.title || content.subtitle) && (
          <div className={`mb-8 ${textAlignClass}`}>
            {content.title && (
              <h2 className="font-luxury-heading text-3xl text-[var(--color-ink)] md:text-4xl">
                {translate(content.title)}
              </h2>
            )}
            {content.subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-subtle md:text-base">
                {translate(content.subtitle)}
              </p>
            )}
          </div>
        )}
        <div className="overflow-x-auto border-y border-[var(--color-ink)]/20">
          <table className={`min-w-full border-collapse text-sm text-[var(--color-ink)] ${textAlignClass}`}>
            {showHeader && (
              <thead className="border-b border-[var(--color-ink)]/20">
                <tr>
                  {columns.map((column) => (
                    <th key={column.id} className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.14em]">
                      {translate(column.label)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className={striped && rowIndex % 2 === 1 ? "bg-black/[0.025]" : ""}>
                  {columns.map((column) => (
                    <td key={column.id} className="border-t border-[var(--color-ink)]/10 px-4 py-4">
                      {translate(row.cells[column.id] || { zh: "", en: "" })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
