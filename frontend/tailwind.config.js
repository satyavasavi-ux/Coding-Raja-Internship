/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030712",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(56, 189, 248, 0.2)",
          neon: "#38bdf8",
          purple: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b"
        }
      }
    },
  },
  plugins: [],
}
