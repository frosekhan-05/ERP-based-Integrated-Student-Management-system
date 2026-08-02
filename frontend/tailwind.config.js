/** @type {import('tailwindcss').Config} */
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
    },
  },
  plugins: [],
}
