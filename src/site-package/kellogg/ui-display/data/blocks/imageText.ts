import type { ImageTextContent } from '../../components/blocks';

export const imageTextProps: ImageTextContent = {
  title: { zh: "高支澳洲羊毛面料工艺", en: "Australian Wool Craftsmanship" },
  content: {
    zh: "我们所有的西装及厚重大衣均选用来自澳大利亚天然牧场的高级细羊毛。历经数十道纺纱、织造、整理工艺，面料表面呈现润泽质感，同时具备极强的垂坠性与极佳的防皱保型表现。",
    en: "All of our luxury suits and heavy wool coats are crafted from premium Australian merino wool. Through dozens of fine spinning, weaving, and finishing processes, the fabric presents a rich luster, elegant drape, and outstanding crease-resistant recovery."
  },
  image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80",
  imagePosition: "left",
  buttonText: { zh: "阅读定制手册", en: "Read Custom Handbook" },
  buttonLink: "/custom-handbook"
};

export default imageTextProps;
