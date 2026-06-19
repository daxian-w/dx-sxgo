import type { Config } from "tailwindcss"

const { fontFamily } = require("tailwindcss/defaultTheme")

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      fontFamily: {
        sans: ["Noto Sans SC", ...fontFamily.sans],
        serif: ["Noto Serif SC", ...fontFamily.serif],
        mono: ["IBM Plex Mono", ...fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 双休购色系 - 米色、浅绿色、黄绿色、浅黄色、象牙灰
        primary: {
          DEFAULT: "#3DAD8A",  // 浅绿色主色
          foreground: "#FFFFFF",
          50: "#F0F7F3",
          100: "#D9EEE5",
          200: "#B8E4D4",
          300: "#8DD4BD",
          400: "#5CBFA4",
          500: "#3DAD8A",
          600: "#2E8B6F",
          700: "#226A56",
          800: "#1A4D3E",
          900: "#0F3029",
        },

        secondary: {
          DEFAULT: "#F5C234",  // 浅黄色强调
          foreground: "#2A2620",
          50: "#FFFEF5",
          100: "#FEF8E0",
          200: "#FDEDBA",
          300: "#FBE088",
          400: "#F9D046",
          500: "#F5C234",
          600: "#E0A820",
          700: "#B8851A",
          800: "#8C6614",
          900: "#6B500F",
        },

        accent: {
          DEFAULT: "#99D93F",  // 黄绿色活力
          foreground: "#2A2620",
          50: "#FAFEF3",
          100: "#F0FAD7",
          200: "#E1F5B0",
          300: "#CFED82",
          400: "#B5E156",
          500: "#99D93F",
          600: "#7DBE2E",
          700: "#5D9620",
          800: "#468117",
          900: "#346310",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // 中性色 - 象牙灰系列
        neutral: {
          50: "#FFFAF5",
          100: "#F5F0E8",
          200: "#E8DFD3",
          300: "#D4C8B8",
          400: "#B8AA98",
          500: "#9B8F80",
          600: "#7D7367",
          700: "#5F574E",
          800: "#423D36",
          900: "#2A2620",
          950: "#1A1512",
        },

        // 米色系列
        beige: {
          50: "#FEFDF9",
          100: "#FAF5ED",
          200: "#F3EBD9",
          300: "#E8DCC1",
          400: "#D4C9A8",
          500: "#BDB38F",
          600: "#A69878",
          700: "#8B7D63",
          800: "#6B6450",
          900: "#514C3E",
        },

        // 状态色
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#E5484D",

        // 保持原有的 base 和 gray 系列以兼容现有组件
        base: {
          black: "#0A0A0A",
          975: "#121212",
          950: "#1B1B1B",
          900: "#242424",
          850: "#2D2D2D",
          800: "#363636",
          700: "#4A4A4A",
          600: "#5E5E5E",
          500: "#727272",
          300: "#9C9C9C",
          200: "#B6B6B6",
          150: "#D0D0D0",
          100: "#EAEAEA",
          50: "#F5F5F5",
          25: "#FAFAFA",
          paper: "#FFFFFF",
        },

        gray: {
          "25": "#fbfbfb",
          "50": "#f6f6f6",
          "100": "#e7e7e7",
          "200": "#d1d1d1",
          "300": "#b0b0b0",
          "400": "#999999",
          "500": "#6d6d6d",
          "600": "#5d5d5d",
          "700": "#4f4f4f",
          "800": "#454545",
          "900": "#3d3d3d",
          "950": "#262626",
          "975": "#1e1e1e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
