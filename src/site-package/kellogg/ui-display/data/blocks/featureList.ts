import type { FeatureListContent } from '../../block-adapters/featureListAdapter';

export const featureListProps: FeatureListContent = {
  title: {
    zh: "我们为什么独一无二？",
    en: "Why Choose Us?"
  },
  subtitle: {
    zh: "从选材、工艺到绿色可持续的时尚态度",
    en: "From material, craftsmanship to sustainable fashion attitude"
  },
  items: [
    {
      icon: "Leaf",
      title: { zh: "可再生环保面料", en: "Eco-friendly Recycled Fabrics" },
      description: { zh: "使用经过全球有机纺织品标准(GOTS)认证的可回收纤维及有机棉材质。", en: "Utilizing GOTS certified recycled fibers and premium organic cotton." }
    },
    {
      icon: "Scissors",
      title: { zh: "手工立裁版型", en: "Hand-draped Patterns" },
      description: { zh: "经验丰富的版型师手工三维立体裁剪，贴合人体结构，活动舒适自如。", en: "Experienced pattern makers drape in 3D to fit human body structure comfortably." }
    },
    {
      icon: "Sparkles",
      title: { zh: "双面精细车缝", en: "Fine Double-stitch Sewing" },
      description: { zh: "每英寸多达 14 针的超密缝纫，针脚平整，穿着平滑耐用。", en: "Dense sewing up to 14 stitches per inch for smooth, flat seams and long durability." }
    }
  ]
};

export default featureListProps;
