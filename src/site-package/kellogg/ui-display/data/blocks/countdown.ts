import type { CountdownContent } from '../../block-adapters/countdownAdapter';

export const countdownProps: CountdownContent = {
  title: {
    zh: "闪购倒计时特惠",
    en: "Flash Sale Event"
  },
  subtitle: {
    zh: "年度清仓返场，限时极速抢购，全场包邮并享额外折上折！",
    en: "Annual warehouse clearance. Limited time only. Free shipping site-wide + extra checkout discounts!"
  },
  values: {
    endTime: "2026-12-31T23:59:59Z",
    backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80"
  }
};

export default countdownProps;
