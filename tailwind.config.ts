import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "var(--font-sans)"],
        heading: ["var(--font-heading)"],
        quicksand: ["var(--font-quicksand)"],
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
        glow: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.3",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.5",
          },
        },
        "brightness-flicker": {
          "0%": {
            filter:
              "brightness(0) contrast(1.1) drop-shadow(0 0 4px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 12px rgba(139, 92, 246, 0.2))",
          },
          "25%": {
            filter:
              "brightness(2) contrast(1.1) drop-shadow(0 0 12px rgba(139, 92, 246, 1.0)) drop-shadow(0 0 24px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 36px rgba(139, 92, 246, 0.6))",
          },
          "50%": {
            filter:
              "brightness(0) contrast(1.1) drop-shadow(0 0 4px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 12px rgba(139, 92, 246, 0.2))",
          },
          "75%": {
            filter:
              "brightness(0.8) contrast(1.1) drop-shadow(0 0 3px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 6px rgba(139, 92, 246, 0.3)) drop-shadow(0 0 9px rgba(139, 92, 246, 0.1))",
          },
          "100%": {
            filter:
              "brightness(1.3) contrast(1.1) drop-shadow(0 0 4px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 12px rgba(139, 92, 246, 0.2))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 4s ease-in-out infinite",
        "brightness-flicker": "brightness-flicker 0.8s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
