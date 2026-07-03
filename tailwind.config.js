/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "var(--color-border, hsl(var(--border)))",
        input: "var(--color-input, hsl(var(--input)))",
        ring: "var(--color-ring, hsl(var(--ring)))",
        background: "var(--color-background, hsl(var(--background)))",
        foreground: "var(--color-foreground, hsl(var(--foreground)))",
        surface: "var(--color-surface)",
        page: "var(--color-page)",
        panel: "var(--color-panel)",
        soft: "var(--color-soft)",
        media: "var(--color-media)",
        preview: "var(--color-preview)",
        ink: "var(--color-ink)",
        "ink-strong": "var(--color-ink-strong)",
        "ink-glass": "var(--color-ink-glass)",
        body: "var(--color-body)",
        subtle: "var(--color-subtle)",
        brand: "var(--color-brand)",
        rating: "var(--color-rating)",
        "on-dark": "var(--color-on-dark)",
        "on-dark-muted": "var(--color-on-dark-muted)",
        "on-dark-soft": "var(--color-on-dark-soft)",
        "on-dark-faint": "var(--color-on-dark-faint)",
        "on-dark-border": "var(--color-on-dark-border)",
        "on-dark-wash": "var(--color-on-dark-wash)",
        "surface-overlay": "var(--color-surface-overlay)",
        "surface-glass": "var(--color-surface-glass)",
        "overlay-soft": "var(--color-overlay-soft)",
        "overlay-medium": "var(--color-overlay-medium)",
        "overlay-strong": "var(--color-overlay-strong)",
        "inverse-border": "var(--color-inverse-border)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius, 0.625rem) + 4px)",
        lg: "var(--radius, 0.625rem)",
        md: "calc(var(--radius, 0.625rem) - 2px)",
        sm: "calc(var(--radius, 0.625rem) - 4px)",
        xs: "calc(var(--radius, 0.625rem) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
