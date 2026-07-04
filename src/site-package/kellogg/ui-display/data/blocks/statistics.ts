import type { StatisticsContent } from '../../block-adapters/statisticsAdapter';

export const statisticsProps: StatisticsContent = {
  title: {
    zh: "发展与积淀",
    en: "Development & Heritage"
  },
  subtitle: {
    zh: "我们用数据和信誉来践行对每一位用户的承诺",
    en: "Fulfilling our promises with solid metrics and reputation"
  },
  items: [
    {
      id: 1,
      value: "150+",
      label: { zh: "全球合作零售商", en: "Global Retail Partners" }
    },
    {
      id: 2,
      value: "99.2%",
      label: { zh: "客户满意度", en: "Customer Satisfaction" }
    },
    {
      id: 3,
      value: "20m+",
      label: { zh: "年均成衣出口", en: "Annual Garment Exports" }
    },
    {
      id: 4,
      value: "12",
      label: { zh: "国际顶级设计奖", en: "Design Awards Won" }
    }
  ]
};

export default statisticsProps;
