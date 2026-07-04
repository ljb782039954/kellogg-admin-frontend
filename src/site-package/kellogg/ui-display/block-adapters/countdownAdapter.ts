import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface CountdownValuesContent {
  endTime?: string;
  backgroundImage?: string;
}

export interface CountdownContent {
  title?: Translation;
  subtitle?: Translation;
  values?: CountdownValuesContent;
}
import type { CountdownProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export function toCountdownViewProps(
  content: CountdownContent,
  lang: Language,
): CountdownProps {
  const translate = createTranslate(lang);

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    endTime: content.values?.endTime,
    backgroundImage: content.values?.backgroundImage,
    labels: {
      days: lang === "zh" ? "天" : "Days",
      hours: lang === "zh" ? "时" : "Hours",
      minutes: lang === "zh" ? "分" : "Min",
      seconds: lang === "zh" ? "秒" : "Sec",
    },
  };
}
