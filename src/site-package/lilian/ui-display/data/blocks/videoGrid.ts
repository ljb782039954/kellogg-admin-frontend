import type { VideoGridContent } from "../../components/blocks";

const videoGrid: VideoGridContent = {
  items: [
    {
      title: { zh: "工作室", en: "The Atelier" },
      url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      coverImage: "/lilian/image/product1.jpg",
      aspect: "auto",
    },
    {
      title: { zh: "真丝织造", en: "Silk Weaving" },
      url: "https://vimeo.com/76979871",
      coverImage: "/lilian/image/product2.jpg",
      aspect: "auto",
    },
    {
      title: { zh: "短片花絮", en: "Short Film" },
      url: "https://www.youtube.com/shorts/ScMzIvxBSi4",
      coverImage: "/lilian/image/product3.jpg",
      aspect: "portrait",
    },
    {
      title: { zh: "秀场", en: "Runway Show" },
      url: "https://www.tiktok.com/@scout2015/video/6718335390845095173",
      coverImage: "/lilian/image/product4.jpg",
      aspect: "portrait",
    },
    {
      title: { zh: "幕后", en: "Behind Seams" },
      url: "https://www.facebook.com/facebook/videos/10153231379946729/",
      coverImage: "/lilian/image/hero.jpg",
      aspect: "video",
    },
    {
      title: { zh: "社交动态", en: "Social Clip" },
      url: "https://twitter.com/Twitter/status/1456358704046739462",
      coverImage: "/lilian/image/about.jpg",
      aspect: "square",
    },
  ],
};

export default videoGrid;
