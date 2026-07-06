import type { FeatureListContent } from "../../types";

const featureList: FeatureListContent = {
  title: {
    zh: "为什么选择 Lilian",
    en: "Why Lilian",
  },
  subtitle: {
    zh: "将品牌优势、产品特点或服务能力整理成清晰可扫读的内容列表。",
    en: "A scannable list for brand values, product highlights, or service promises.",
  },
  items: [
    {
      icon: "Sparkles",
      title: { zh: "高质感面料", en: "Refined Materials" },
      description: {
        zh: "优先选择垂坠、触感与耐穿度兼具的面料。",
        en: "Materials chosen for drape, touch, and lasting wear.",
      },
    },
    {
      icon: "Ruler",
      title: { zh: "比例友好的剪裁", en: "Considered Fit" },
      description: {
        zh: "用肩线、腰线与裙长细节改善真实穿着比例。",
        en: "Shoulder, waist, and length details tuned for real styling proportions.",
      },
    },
    {
      icon: "PackageCheck",
      title: { zh: "稳定交付", en: "Reliable Delivery" },
      description: {
        zh: "支持系列化选品、样衣沟通与批量采购询盘。",
        en: "Supports collection planning, sample review, and bulk inquiry workflows.",
      },
    },
  ],
};

export default featureList;
