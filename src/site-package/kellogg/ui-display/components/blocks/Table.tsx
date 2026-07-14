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

export default function Table({ content, lang }: TableProps) {
  const translate = createTranslate(lang);
  const { columns, rows, showHeader = true, striped = false, textAlign = "left" } = content;
  const textAlignClass = textAlign === "center" ? "text-center" : "text-left";

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        {(content.title || content.subtitle) && (
          <div className={`mb-6 ${textAlignClass}`}>
            {content.title && (
              <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
                {translate(content.title)}
              </h2>
            )}
            {content.subtitle && (
              <p className="mt-2 text-sm text-gray-500 md:text-base">
                {translate(content.subtitle)}
              </p>
            )}
          </div>
        )}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className={`min-w-full border-collapse text-sm text-gray-700 ${textAlignClass}`}>
            {showHeader && (
              <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-700">
                <tr>
                  {columns.map((column) => (
                    <th key={column.id} className="border-b border-gray-200 px-4 py-3">
                      {translate(column.label)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className={striped && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                  {columns.map((column) => (
                    <td key={column.id} className="border-b border-gray-100 px-4 py-3 last:border-b-0">
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
