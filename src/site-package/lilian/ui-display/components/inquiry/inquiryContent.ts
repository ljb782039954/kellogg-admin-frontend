import type {
  InquiryPageContent,
  InquiryTranslations,
} from '@/cms/types';
import type { Language } from "@/cms/types";

export const lilianInquiryContent: InquiryPageContent = {
  title: {
    zh: "联系我们获取样品",
    en: "Contact Us For Samples",
  },
  description: {
    zh: "如果您有任何产品咨询，请填写表格，我们的团队会尽快与您联系。",
    en: "If you have any inquiries about our products, please fill out the form and our team will get back to you as soon as possible.",
  },
};

const lilianInquiryTranslations: Record<"zh" | "en", InquiryTranslations> = {
  zh: {
    form: {
      name: "姓名",
      email: "邮箱",
      phone: "电话",
      country: "国家/地区",
      company: "公司名称",
      productType: "产品类型",
      quantity: "需求数量",
      message: "消息详情",
      submit: "提交询盘",
      success: "提交成功！",
      successMsg: "感谢您的咨询，我们会尽快与您联系。",
      back: "返回",
    },
    alerts: {
      turnstileRequired: "请先完成人机验证",
      submitFailed: "提交失败，请重试",
    },
  },
  en: {
    form: {
      name: "First Name",
      email: "Email",
      phone: "Phone Number",
      country: "Country/Region",
      company: "Company Name",
      productType: "Product Type",
      quantity: "Order Quantity",
      message: "Message details",
      submit: "Submit Inquiry",
      success: "Success!",
      successMsg: "Thank you for your inquiry, we will contact you soon.",
      back: "Go Back",
    },
    alerts: {
      turnstileRequired: "Please complete the human verification",
      submitFailed: "Submission failed, please try again",
    },
  },
};

export function getLilianInquiryTranslations(lang: Language): InquiryTranslations {
  return lilianInquiryTranslations[lang as "zh" | "en"] || lilianInquiryTranslations.en;
}

export function getLilianInquiryFormText(lang: Language) {
  const translations = getLilianInquiryTranslations(lang).form;
  const isZh = lang === "zh";

  return {
    ...translations,
    placeholders: {
      name: isZh ? "请输入您的姓名" : "Enter your name",
      email: "example@email.com",
      phone: "+1...",
      country: isZh ? "输入国家" : "Your country",
      company: isZh ? "输入公司名称" : "Company name",
      product_type: isZh ? "想要的产品" : "Interested product",
      quantity: "e.g. 500 pcs",
      message: isZh ? "告诉我们您的具体需求" : "Tell us about your requirements...",
    },
  };
}
