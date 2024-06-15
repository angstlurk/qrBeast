const konstaConfig = require("konsta/config");
/** @type {import('tailwindcss').Config} */
export default konstaConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fly: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        fly: "fly 2s infinite",
        shake: "shake 2s infinite",
      },
    },
  },
  plugins: [],
});
