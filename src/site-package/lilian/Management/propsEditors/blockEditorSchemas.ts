import type { BlockContentMap, BlockType } from '../../ui-display/types';
import { defineEditorSchema, type EditorSchema } from '@/core-adminApp/ui/Management/blockForm/BlockFormEditor';

const videoAspectOptions = [
  { label: '自适应', value: 'auto' },
  { label: '横向', value: 'video' },
  { label: '竖向', value: 'portrait' },
  { label: '方形', value: 'square' },
] as const;

const heightOptions = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
] as const;

const parallaxHeightOptions = [
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
] as const;

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
] as const;

const maxWidthOptions = [
  { label: '窄', value: 'narrow' },
  { label: '中', value: 'medium' },
  { label: '宽', value: 'wide' },
] as const;

const imageItemFields = [
  {
    key: 'image',
    label: '图片',
    type: 'image',
    aspectRatio: 'banner',
    maxWidth: 1600,
  },
  {
    key: 'imageAlt',
    label: '图片描述',
    type: 'translation',
    description: '用于图片 alt 文案，也有利于 SEO。',
  },
  {
    key: 'caption',
    label: '图片标题 / 说明',
    type: 'translation',
  },
] as const;

const headingFields = [
  {
    key: 'title',
    label: '标题',
    type: 'translation',
  },
  {
    key: 'subtitle',
    label: '副标题',
    type: 'translation',
  },
] as const;

const headingFieldsRichText = [
  {
    key: 'title',
    label: '标题',
    type: 'translation',
  },
  {
    key: 'subtitle',
    label: '副标题',
    type: 'richText',
    rows: 4,
  },
] as const;


const imageFields = [
  {
    key: 'image',
    label: '图片',
    type: 'image',
    aspectRatio: 'banner',
    maxWidth: 1800,
  },
  {
    key: 'imageAlt',
    label: '图片描述',
    type: 'translation',
  },
] as const;

const videoItemFields = [
  {
    key: 'title',
    label: '标题',
    type: 'translation',
  },
  {
    key: 'url',
    label: '视频链接',
    type: 'text',
    placeholder: 'YouTube / Vimeo / TikTok / Facebook / X 链接',
  },
  {
    key: 'coverImage',
    label: '封面图',
    type: 'image',
    aspectRatio: 'video',
    maxWidth: 1600,
  },
  {
    key: 'coverImageAlt',
    label: '封面图描述',
    type: 'translation',
  },
  {
    key: 'description',
    label: '视频说明',
    type: 'richText',
    rows: 5,
  },
  {
    key: 'aspect',
    label: '视频比例',
    type: 'select',
    options: videoAspectOptions,
  },
] as const;

const defineBlockSchema = <T extends BlockType>() =>
  defineEditorSchema<BlockContentMap[T]>();

export const blockEditorSchemas: Partial<Record<BlockType, EditorSchema>> = {
  brandManifesto: defineBlockSchema<'brandManifesto'>()([
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'quote',
      label: '宣言正文',
      type: 'translation',
    },
    {
      key: 'attribution',
      label: '署名',
      type: 'translation',
    },
    {
      key: 'backgroundColor',
      label: '背景色',
      type: 'color',
    },
  ]),

  
  beforeAfterSlider: defineBlockSchema<'beforeAfterSlider'>()([
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'beforeImage',
      label: '对比前图片',
      type: 'image',
      aspectRatio: 'banner',
      maxWidth: 1800,
    },
    {
      key: 'beforeImageAlt',
      label: '对比前图片描述',
      type: 'translation',
    },
    {
      key: 'afterImage',
      label: '对比后图片',
      type: 'image',
      aspectRatio: 'banner',
      maxWidth: 1800,
    },
    {
      key: 'afterImageAlt',
      label: '对比后图片描述',
      type: 'translation',
    },
  ]),


  categories: defineBlockSchema<'categories'>()([
    ...headingFields,
    {
      key: 'showAll',
      label: '显示全部分类',
      type: 'switch',
    },
    {
      key: 'maxItems',
      label: '最多显示数量',
      type: 'select',
      options: [
        { label: '4', value: 4 },
        { label: '6', value: 6 },
        { label: '8', value: 8 },
        { label: '12', value: 12 },
      ],
    },
  ]),

  categories2: defineBlockSchema<'categories2'>()([
    {
      key: 'showAll',
      label: '显示全部分类',
      type: 'switch',
    },
    {
      key: 'maxItems',
      label: '最多显示数量',
      type: 'select',
      options: [
        { label: '4', value: 4 },
        { label: '6', value: 6 },
        { label: '8', value: 8 },
        { label: '12', value: 12 },
      ],
    },
  ]),


  newArrivals: defineBlockSchema<'newArrivals'>()([
    ...headingFieldsRichText,
    {
      key: 'maxItems',
      label: '显示商品数量',
      type: 'select',
      options: [
        { label: '4', value: 4 },
        { label: '8', value: 8 },
      ],
    },
  ]),

  featuredProducts: defineBlockSchema<'featuredProducts'>()([
    ...headingFields,
    {
      key: 'maxItems',
      label: '显示商品数量',
      type: 'select',
      options: [
        { label: '4', value: 4 },
        { label: '8', value: 8 },
      ],
    },
  ]),

  productGrid: defineBlockSchema<'productGrid'>()([
    ...headingFields,
    {
      key: 'itemsPerPage',
      label: '每页商品数量',
      type: 'select',
      options: [
        { label: '4', value: 4 },
        { label: '8', value: 8 },
        { label: '12', value: 12 },
        { label: '16', value: 16 },
        { label: '20', value: 20 },
      ],
    },
  ]),

  featureList: defineBlockSchema<'featureList'>()([
    ...headingFields,
    {
      key: 'items',
      label: '特点',
      type: 'repeater',
      defaultItem: {
        icon: 'Sparkles',
        title: { zh: '', en: '' },
        description: { zh: '', en: '' },
      },
      fields: [
        {
          key: 'icon',
          label: '图标名称',
          type: 'text',
          placeholder: 'Lucide icon name，例如 Sparkles',
        },
        {
          key: 'title',
          label: '标题',
          type: 'translation',
        },
        {
          key: 'description',
          label: '说明',
          type: 'richText',
          rows: 5,
        },
      ],
    },
  ]),

  imagePairGrid: defineBlockSchema<'imagePairGrid'>()([
    {
      key: 'images',
      label: '图片',
      type: 'repeater',
      minItems: 2,
      maxItems: 2,
      defaultItem: {
        image: '',
        imageAlt: { zh: '', en: '' },
        caption: { zh: '', en: '' },
      },
      fields: imageItemFields,
    },
  ]),

  masonryGallery: defineBlockSchema<'masonryGallery'>()([
    {
      key: 'images',
      label: '图片',
      type: 'repeater',
      defaultItem: {
        image: '',
        imageAlt: { zh: '', en: '' },
        caption: { zh: '', en: '' },
        heightClass: 'h-80',
      },
      fields: [
        ...imageItemFields,
        {
          key: 'heightClass',
          label: '图片高度类名',
          type: 'select',
          options: [
            { label: '低', value: 'h-60' },
            { label: '中低', value: 'h-64' },
            { label: '中', value: 'h-72' },
            { label: '高', value: 'h-80' },
            { label: '超高', value: 'h-96' },
          ],
        },
      ],
    },
  ]),

  imageCarousel: defineBlockSchema<'imageCarousel'>()([
    {
      key: 'images',
      label: '轮播图片',
      type: 'repeater',
      defaultItem: {
        image: '',
        imageAlt: { zh: '', en: '' },
        caption: { zh: '', en: '' },
      },
      fields: imageItemFields,
    },
    {
      key: 'autoplay',
      label: '自动播放',
      type: 'switch',
    },
    {
      key: 'interval',
      label: '切换间隔（毫秒）',
      type: 'number',
      min: 1000,
      max: 20000,
      step: 500,
    },
  ]),

  fullWidthBanner: defineBlockSchema<'fullWidthBanner'>()([
    ...imageFields,
    {
      key: 'height',
      label: '高度',
      type: 'select',
      options: heightOptions,
    },
  ]),

  imageTextSplit: defineBlockSchema<'imageTextSplit'>()([
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'content',
      label: '正文',
      type: 'richText',
      rows: 5,
    },
    ...imageFields,
    {
      key: 'imagePosition',
      label: '图片位置',
      type: 'select',
      options: [
        { label: '左侧', value: 'left' },
        { label: '右侧', value: 'right' },
      ],
    },
  ]),

  parallaxImage: defineBlockSchema<'parallaxImage'>()([
    ...imageFields,
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'height',
      label: '高度',
      type: 'select',
      options: parallaxHeightOptions,
    },
  ]),


  lightboxGallery: defineBlockSchema<'lightboxGallery'>()([
    {
      key: 'images',
      label: '灯箱图片',
      type: 'repeater',
      defaultItem: {
        image: '',
        imageAlt: { zh: '', en: '' },
        caption: { zh: '', en: '' },
      },
      fields: imageItemFields,
    },
  ]),

  fullscreenImageBackground: defineBlockSchema<'fullscreenImageBackground'>()([
    ...imageFields,
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'overlay',
      label: '显示遮罩',
      type: 'switch',
    },
  ]),

  videoGrid: defineBlockSchema<'videoGrid'>()([
    {
      key: 'items',
      label: '视频',
      type: 'repeater',
      defaultItem: {
        title: { zh: '', en: '' },
        url: '',
        coverImage: '',
        coverImageAlt: { zh: '', en: '' },
        description: { zh: '', en: '' },
        aspect: 'video',
      },
      fields: videoItemFields,
    },
  ]),

  fullscreenVideoPopup: defineBlockSchema<'fullscreenVideoPopup'>()([
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'url',
      label: '视频链接',
      type: 'text',
    },
    {
      key: 'coverImage',
      label: '封面图',
      type: 'image',
      aspectRatio: 'video',
      maxWidth: 1600,
    },
    {
      key: 'coverImageAlt',
      label: '封面图描述',
      type: 'translation',
    },
    {
      key: 'aspect',
      label: '视频比例',
      type: 'select',
      options: videoAspectOptions,
    },
    {
      key: 'description',
      label: '说明',
      type: 'translation',
    },
  ]),


  numberCounter: defineBlockSchema<'numberCounter'>()([
    {
      key: 'stats',
      label: '数字',
      type: 'repeater',
      defaultItem: {
        value: 0,
        suffix: '',
        label: { zh: '', en: '' },
      },
      fields: [
        {
          key: 'value',
          label: '数值',
          type: 'number',
        },
        {
          key: 'suffix',
          label: '后缀',
          type: 'text',
          placeholder: '+ / % / 件',
        },
        {
          key: 'label',
          label: '说明',
          type: 'translation',
        },
      ],
    },
  ]),

  testimonialMasonry: defineBlockSchema<'testimonialMasonry'>()([
    {
      key: 'items',
      label: '评价',
      type: 'repeater',
      defaultItem: {
        name: { zh: '', en: '' },
        company: { zh: '', en: '' },
        avatar: '',
        text: { zh: '', en: '' },
        rating: 5,
      },
      fields: [
        {
          key: 'name',
          label: '客户姓名',
          type: 'translation',
        },
        {
          key: 'company',
          label: '公司 / 来源',
          type: 'translation',
        },
        {
          key: 'avatar',
          label: '头像',
          type: 'image',
          aspectRatio: 'square',
          maxWidth: 400,
        },
        {
          key: 'text',
          label: '评价内容',
          type: 'translation',
        },
        {
          key: 'rating',
          label: '评分',
          type: 'number',
          min: 1,
          max: 5,
        },
      ],
    },
  ]),

  faqAccordion: defineBlockSchema<'faqAccordion'>()([
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'items',
      label: '问答',
      type: 'repeater',
      defaultItem: {
        question: { zh: '', en: '' },
        answer: { zh: '', en: '' },
      },
      fields: [
        {
          key: 'question',
          label: '问题',
          type: 'translation',
        },
        {
          key: 'answer',
          label: '回答',
          type: 'translation',
        },
      ],
    },
  ]),

  certificationBadges: defineBlockSchema<'certificationBadges'>()([
    {
      key: 'eyebrow',
      label: '眉标题',
      type: 'translation',
    },
    {
      key: 'certifications',
      label: '认证',
      type: 'repeater',
      defaultItem: {
        name: '',
        fullName: { zh: '', en: '' },
        description: { zh: '', en: '' },
      },
      fields: [
        {
          key: 'name',
          label: '简称',
          type: 'text',
        },
        {
          key: 'fullName',
          label: '完整名称',
          type: 'translation',
        },
        {
          key: 'description',
          label: '说明',
          type: 'translation',
        },
      ],
    },
  ]),

  mainHeading: defineBlockSchema<'mainHeading'>()([
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'translation',
    },
    {
      key: 'description',
      label: '描述',
      type: 'richText',
      rows: 5,
    },
    {
      key: 'align',
      label: '对齐方式',
      type: 'select',
      options: alignOptions,
    },
  ]),

  richTextBlock: defineBlockSchema<'richTextBlock'>()([
    {
      key: 'title',
      label: '标题',
      type: 'translation',
    },
    {
      key: 'content',
      label: '正文',
      type: 'richText',
      rows: 8,
    },
    {
      key: 'align',
      label: '对齐方式',
      type: 'select',
      options: alignOptions,
    },
    {
      key: 'maxWidth',
      label: '最大宽度',
      type: 'select',
      options: maxWidthOptions,
    },
  ]),

  textGrid: defineBlockSchema<'textGrid'>()([
    {
      key: 'items',
      label: '文本项',
      type: 'repeater',
      defaultItem: {
        title: { zh: '', en: '' },
        text: { zh: '', en: '' },
      },
      fields: [
        {
          key: 'title',
          label: '标题',
          type: 'translation',
        },
        {
          key: 'text',
          label: '正文',
          type: 'richText',
          rows: 5,
        },
      ],
    },
  ]),
};
