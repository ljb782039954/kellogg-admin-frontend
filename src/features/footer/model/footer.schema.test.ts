import { describe, expect, it } from 'vitest';
import { footerSchema } from './footer.schema';

const validFooter = {
  linkGroups: [{
    id: 'group_1',
    title: { zh: '帮助', en: 'Help' },
    links: [{
      id: 'link_1',
      name: { zh: '联系', en: 'Contact' },
      linkType: 'internal' as const,
      href: '/contact',
    }],
  }],
  newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
  newsletterButton: { zh: '订阅', en: 'Subscribe' },
};

describe('footer schema', () => {
  it('accepts a complete footer', () => {
    expect(footerSchema.safeParse(validFooter).success).toBe(true);
  });

  it('rejects missing translations and unsupported link types', () => {
    expect(footerSchema.safeParse({
      ...validFooter,
      newsletterButton: { zh: '订阅' },
    }).success).toBe(false);

    expect(footerSchema.safeParse({
      ...validFooter,
      linkGroups: [{
        ...validFooter.linkGroups[0],
        links: [{ ...validFooter.linkGroups[0].links[0], linkType: 'email' }],
      }],
    }).success).toBe(false);
  });

  it('allows the derived pageDeleted flag when present', () => {
    const footer = {
      ...validFooter,
      linkGroups: validFooter.linkGroups.map((group) => ({
        ...group,
        links: group.links.map((link) => ({ ...link, pageDeleted: true })),
      })),
    };
    expect(footerSchema.safeParse(footer).success).toBe(true);
  });
});
