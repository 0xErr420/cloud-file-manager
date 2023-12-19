/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        folder: "#5F6AFF", // Folder icons
        "folder-dark": "#3149FF", // Dark theme folder icons
        file: "#989BA2", // File icons
        selection: "#F2F2F4", // Folder tree active selection
        "selection-dark": "#111111", // Dark theme tree active selection
        header: "#EDEFF2", // Table header
        "header-dark": "#1F2535", // Dark theme table header
        "selected-row": "#EAF0FE", // Table current selected row
        "selected-row-dark": "#0A1372", // Dark theme current selected row
        accent: "#3448FE", // Blue accent
        "accent-dark": "#1845DC", // Dark theme blue accent
        sidebar: "#F6F7F9", // Side bar background
        "sidebar-dark": "#1F2533", // Dark theme side background
        // Utilize existing Tailwind colors for the main background
        background: "#FFFFFF", // Main background
        "background-dark": "#000000", // Dark theme main background
      },
    },
  },
  plugins: [],
};
