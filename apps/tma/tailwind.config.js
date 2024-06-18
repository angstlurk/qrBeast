const konstaConfig = require("konsta/config");
/** @type {import('tailwindcss').Config} */
export default konstaConfig({
  konsta: {
    colors: {
      // "primary" is the main app color, if not specified will be default to '#007aff'
      primary: "#101010",
    },
  },
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

        blur: {
          "0%": { filter: "blur(0px)" },
          "100%": { filter: "blur(8px)" },
        },
        unblur: {
          "0%": { filter: "blur(8px)" },
          "100%": { filter: "blur(0px)" },
        },
      },
      animation: {
        fly: "fly 2s infinite",
        shake: "shake 2s infinite",
        blur: "blur 1s ease-in-out forwards",
        unblur: "unblur 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
});
