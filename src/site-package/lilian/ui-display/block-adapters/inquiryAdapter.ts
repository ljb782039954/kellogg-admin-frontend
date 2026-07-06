import type { FormEvent } from "react";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface InquiryContent {
  title?: Translation;
  subtitle?: Translation;
}


import type { Language } from "@/cms/types";
import type { InquiryFormValues, InquiryProps } from "../components/blocks/Inquiry";
import { createTranslate } from "../utils/i18n";

function emptyInquiryValues(): InquiryFormValues {
  return {
    name: "",
    email: "",
    company: "",
    product_type: "",
    quantity: "",
    message: "",
  };
}

export function toInquiryViewProps(content: InquiryContent, lang: Language): InquiryProps {
  const translate = createTranslate(lang);
  const isZh = lang === "zh";

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    values: emptyInquiryValues(),
    text: {
      name: isZh ? "姓名" : "Name",
      email: isZh ? "邮箱" : "Email",
      company: isZh ? "公司" : "Company",
      productType: isZh ? "关注品类" : "Product Type",
      quantity: isZh ? "预计数量" : "Estimated Quantity",
      message: isZh ? "需求说明" : "Message",
      submit: isZh ? "提交询盘" : "Submit Inquiry",
      placeholders: {
        name: isZh ? "请输入您的姓名" : "Your name",
        email: isZh ? "请输入您的邮箱" : "Your email",
        company: isZh ? "公司或品牌名称" : "Company or brand name",
        product_type: isZh ? "例如 Dresses / Blazers" : "E.g. Dresses / Blazers",
        quantity: isZh ? "例如 300 件" : "E.g. 300 pcs",
        message: translate(content.subtitle, isZh ? "请描述您的采购需求。" : "Tell us about your sourcing needs."),
      },
    },
    onValuesChange: () => {},
    onSubmit: (event: FormEvent<HTMLFormElement>) => event.preventDefault(),
  };
}
