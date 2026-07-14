import type { FAQContent } from '../../components/blocks';

export const faqProps: FAQContent = {
  title: {
    zh: "常见问题解答",
    en: "Frequently Asked Questions"
  },
  subtitle: {
    zh: "关于材质、定制起订量、生产和交付周期的专业解答",
    en: "Professional answers regarding fabric, OEM MOQ, and delivery timeline"
  },
  items: [
    {
      id: 1,
      question: { zh: "常规定制起订量 (MOQ) 是多少？", en: "What is the Minimum Order Quantity (MOQ) for custom orders?" },
      answer: { zh: "我们支持小批量定制。对于常规面料产品起订量通常是每款 50 件起，特殊定制面料则需要根据实际工艺评估。", en: "We support small batches. For regular fabrics, the MOQ is 50 pcs per style. Custom fabrics require specific craftsmanship evaluation." }
    },
    {
      id: 2,
      question: { zh: "大货生产及出货周期大概多久？", en: "How long is the bulk production and shipping lead time?" },
      answer: { zh: "样衣确认后，常规大货生产周期通常为 15-25 天。根据运输渠道不同，海运需要约 20-30 天，空运快递仅需 5-7 个工作日。", en: "After sample approval, bulk production takes 15-25 days. Shipping takes 20-30 days by sea and 5-7 business days by air." }
    }
  ]
};

export default faqProps;
