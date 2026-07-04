interface InquirySectionProps {
  title?: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
}

export const inquiryProps: InquirySectionProps = {
  title: {
    zh: "获取您的专属大货定制报价",
    en: "Request Your Custom Bulk Quote"
  },
  subtitle: {
    zh: "请在下方填写您的联系方式与特定需求，我们将为您指派资深项目经理对接。",
    en: "Please fill out your contact details and custom requirements. An experienced manager will contact you shortly."
  }
};

export default inquiryProps;
