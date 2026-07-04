export interface CtaBannerProps {
  title?: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  cta?: { zh: string; en: string };
  link?: { type: string; href: string };
}

export const ctaBannerProps: CtaBannerProps = {
  title: {
    zh: "准备好开启您的独特商业定制了吗？",
    en: "Ready to Start Your Custom Order?"
  },
  subtitle: {
    zh: "立即提交您的定制询盘信息，专属大客户经理将在 12 小时内为您提供报价与方案！",
    en: "Submit your custom inquiry now, our dedicated key account manager will provide quote in 12 hours!"
  },
  cta: { zh: "立即提交询盘", en: "Submit Inquiry" },
  link: { type: "page", href: "/inquiry" }
};

export default ctaBannerProps;
