import { Parser } from "htmlparser2";

const allowedTags = new Set([
  "a", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3", "h4",
  "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "span", "strong",
  "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "ul",
]);

const blockedTags = new Set([
  "embed", "iframe", "math", "object", "script", "style", "svg", "template",
]);

const voidTags = new Set(["br", "hr", "img"]);
const globalAttributes = new Set(["class"]);
const allowedAttributes: Record<string, Set<string>> = {
  a: new Set(["href", "name", "target", "rel", "title"]),
  img: new Set(["src", "srcset", "sizes", "alt", "title", "width", "height", "loading"]),
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isSafeUrl(value: string, tagName: string): boolean {
  const normalized = value.trim().replace(/[\u0000-\u001F\u007F\s]+/g, "");
  if (!normalized || normalized.startsWith("//")) return false;
  if (normalized.startsWith("#") || normalized.startsWith("/") || normalized.startsWith("./") || normalized.startsWith("../")) {
    return true;
  }

  const scheme = normalized.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (!scheme) return true;
  return tagName === "img"
    ? scheme === "http" || scheme === "https"
    : ["http", "https", "mailto", "tel"].includes(scheme);
}

function sanitizeSrcset(value: string): string | null {
  const candidates = value.split(",").map((candidate) => candidate.trim()).filter(Boolean);
  if (!candidates.length) return null;

  const safeCandidates = candidates.filter((candidate) => {
    const [url] = candidate.split(/\s+/, 1);
    return Boolean(url && isSafeUrl(url, "img"));
  });
  return safeCandidates.length === candidates.length ? safeCandidates.join(", ") : null;
}

function sanitizeAttributes(tagName: string, attributes: Record<string, string>): string {
  const allowedForTag = allowedAttributes[tagName] ?? new Set<string>();
  const sanitized: Record<string, string> = {};

  for (const [rawName, rawValue] of Object.entries(attributes)) {
    const name = rawName.toLowerCase();
    if (!globalAttributes.has(name) && !allowedForTag.has(name)) continue;
    if ((name === "href" || name === "src") && !isSafeUrl(rawValue, tagName)) continue;
    if (name === "srcset") {
      const srcset = sanitizeSrcset(rawValue);
      if (!srcset) continue;
      sanitized[name] = srcset;
      continue;
    }
    if (name === "target" && rawValue !== "_blank" && rawValue !== "_self") continue;
    sanitized[name] = rawValue;
  }

  if (tagName === "a" && sanitized.target === "_blank") {
    sanitized.rel = "noopener noreferrer";
  }
  if (tagName === "img") {
    sanitized.loading ||= "lazy";
  }

  return Object.entries(sanitized)
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join("");
}

export function sanitizeCmsHtml(value: string): string {
  let output = "";
  let blockedDepth = 0;
  const openAllowedTags: string[] = [];

  const parser = new Parser({
    onopentag(tagName, attributes) {
      const tag = tagName.toLowerCase();
      if (blockedTags.has(tag)) {
        blockedDepth += 1;
        return;
      }
      if (blockedDepth || !allowedTags.has(tag)) return;

      output += `<${tag}${sanitizeAttributes(tag, attributes)}>`;
      if (!voidTags.has(tag)) openAllowedTags.push(tag);
    },
    ontext(text) {
      if (!blockedDepth) output += escapeHtml(text);
    },
    onclosetag(tagName) {
      const tag = tagName.toLowerCase();
      if (blockedTags.has(tag)) {
        blockedDepth = Math.max(0, blockedDepth - 1);
        return;
      }
      if (blockedDepth || voidTags.has(tag)) return;

      const index = openAllowedTags.lastIndexOf(tag);
      if (index === -1) return;
      for (let i = openAllowedTags.length - 1; i >= index; i -= 1) {
        output += `</${openAllowedTags[i]}>`;
      }
      openAllowedTags.length = index;
    },
  }, { decodeEntities: true });

  parser.write(value);
  parser.end();

  for (let i = openAllowedTags.length - 1; i >= 0; i -= 1) {
    output += `</${openAllowedTags[i]}>`;
  }
  return output;
}
