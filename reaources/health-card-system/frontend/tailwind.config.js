/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core brand
        ink: {
          DEFAULT: "#12243D",
          light: "#1C3A5E",
          dark: "#0A1829",
        },
        paper: {
          DEFAULT: "#F7F9FB",
          dark: "#0F1724",
        },
        // Primary — teal/vital
        vital: {
          DEFAULT: "#0E7C7B",
          dark: "#0A5F5E",
          light: "#E3F4F3",
          50: "#f0fafa",
          100: "#ccf0ef",
          200: "#9ae1e0",
          300: "#5ec9c8",
          400: "#2badac",
          500: "#0E7C7B",
          600: "#0A5F5E",
          700: "#074747",
          800: "#043232",
          900: "#021c1c",
        },
        // Accent — coral/alert
        coral: {
          DEFAULT: "#E8553A",
          light: "#FDEAE6",
          dark: "#c03d24",
        },
        // Warning/pending — gold
        gold: {
          DEFAULT: "#C9A24B",
          light: "#FDF6E7",
          dark: "#9e7b2e",
        },
        // Neutral mist
        mist: {
          DEFAULT: "#8B98A5",
          light: "#E4E9ED",
          dark: "#404B56",
        },
        // Medical blues
        medical: {
          blue: "#1565C0",
          "blue-light": "#E3F2FD",
          green: "#2E7D32",
          "green-light": "#E8F5E9",
          purple: "#6A1B9A",
          "purple-light": "#F3E5F5",
          orange: "#E65100",
          "orange-light": "#FFF3E0",
        },
        // Dark mode surfaces
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A2332",
          "dark-2": "#232F3E",
          "dark-3": "#2D3B50",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(18, 36, 61, 0.25)",
        soft: "0 2px 12px rgba(18, 36, 61, 0.06)",
        glass: "0 8px 32px 0 rgba(14, 124, 123, 0.15)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(14, 124, 123, 0.4)",
        "glow-gold": "0 0 20px rgba(201, 162, 75, 0.4)",
        "inner-soft": "inset 0 1px 4px rgba(18, 36, 61, 0.05)",
      },
      backgroundImage: {
        "card-gradient": "linear-gradient(135deg, #12243D 0%, #0E7C7B 100%)",
        "card-gradient-v2": "linear-gradient(135deg, #1565C0 0%, #0E7C7B 100%)",
        "hero-gradient": "linear-gradient(135deg, #0F1724 0%, #0E7C7B 40%, #1565C0 100%)",
        "vital-gradient": "linear-gradient(135deg, #0E7C7B 0%, #2BADAC 100%)",
        "gold-gradient": "linear-gradient(135deg, #C9A24B 0%, #e8c76d 100%)",
        "coral-gradient": "linear-gradient(135deg, #E8553A 0%, #ff7c5e 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        "dark-glass": "linear-gradient(135deg, rgba(26,35,50,0.9) 0%, rgba(35,47,62,0.8) 100%)",
        "sidebar-gradient": "linear-gradient(180deg, #12243D 0%, #0A1829 100%)",
        "mesh-gradient": "radial-gradient(at 40% 20%, hsla(175, 79%, 28%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(211, 79%, 44%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 79%, 46%, 0.15) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-gentle": "pulseGentle 2s infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-soft": "bounceSoft 1s ease-in-out infinite",
        "spin-slow": "spin 4s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "count-up": "countUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },
  plugins: [],
};
