/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        noto: ["NotoSansKR", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#171717",
        gray: {
          10: "#171717",
          20: "#3d3d3d",
          30: "#5d5d5d",
          40: "#888888",
          50: "#c4c4c4",
          60: "#fafafa",
        },
        error: "#FF7A7C",
        semantic: "#FF3F62",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        modalOpen: {
          from: { opacity: "0", transform: "translateY(12px) scale(0.85)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "modal-open": "modalOpen 0.3s ease-out forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addBase }) {
      // 기본 텍스트 색상 설정
      addBase({
        "*": {
          color: "#fafafa", // gray-60 색상
        },
      });

      addUtilities({
        /* 대제목 - Black 28pt / Line height : 32px */
        ".typography-main-title": {
          "font-size": "28px",
          "line-height": "32px",
          "font-weight": "800",
          "letter-spacing": "-0.5px",
        },
        /* 중제목 - Regular 20pt / Line height : 32px */
        ".typography-sub-title": {
          "font-size": "20px",
          "line-height": "32px",
          "font-weight": "400",
          "letter-spacing": "-0.5px",
        },
        /* 중제목 - Bold 20pt / Line height : 32px */
        ".typography-sub-title-bold": {
          "font-size": "20px",
          "line-height": "32px",
          "font-weight": "700",
          "letter-spacing": "-0.5px",
        },
        /* 소제목 - Medium 18pt / Line height : 29px */
        ".typography-small-title": {
          "font-size": "18px",
          "line-height": "29px",
          "font-weight": "500",
          "letter-spacing": "-0.5px",
        },
        /* 버튼텍스트, 뉴스상세보기 - Medium 16pt / Line height : 32px */
        ".typography-body1": {
          "font-size": "16px",
          "line-height": "32px",
          "font-weight": "500",
          "letter-spacing": "-0.5px",
        },
        /* 뉴스요약보기, 알림창context - Regular 14pt / Line height : 28px */
        ".typography-body2": {
          "font-size": "14px",
          "line-height": "28px",
          "font-weight": "400",
          "letter-spacing": "-0.5px",
        },
        ".typography-body3": {
          "font-size": "14px",
          "line-height": "22px",
          "font-weight": "500",
          "letter-spacing": "-0.5px",
        },
        /* 주석, 경고문구 - Regular 12pt / Line height : 29px */
        ".typography-caption": {
          "font-size": "12px",
          "line-height": "29px",
          "font-weight": "400",
          "letter-spacing": "-0.5px",
        },
        /* toast description */
        ".typography-caption2": {
          "font-size": "12px",
          "line-height": "20px",
          "font-weight": "400",
          "letter-spacing": "-0.5px",
        },
        /* 원본 기사 보기 */
        ".typography-caption3": {
          "font-size": "10px",
          "line-height": "29px",
          "font-weight": "400",
          "letter-spacing": "-0.5px",
        },
      });
    },
  ],
};
