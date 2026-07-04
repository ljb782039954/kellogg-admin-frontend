import { marked } from "marked";
import { sanitizeCmsHtml } from "@/cms/lib/contentSecurity";

interface RichTextProps {
  value?: string;
  className?: string;
  inline?: boolean;
}

export function decodeHtml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export default function RichText({ value = "", className, inline = false }: RichTextProps) {
  const parsed = inline
    ? marked.parseInline(decodeHtml(value))
    : marked.parse(decodeHtml(value));
  const html = sanitizeCmsHtml(parsed as string);

  return <div className={className} dangerouslySetInnerHTML={{ __html: html as string }} />;
}
