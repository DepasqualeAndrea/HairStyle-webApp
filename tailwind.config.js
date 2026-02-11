/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // Background colors - Dark theme
                'bg-primary': '#0F172A', // Dark navy/slate
                'bg-secondary': '#1E293B', // Slightly lighter
                'bg-tertiary': '#2C2C2E', // Card backgrounds
                'bg-input': '#F1F5F9', // Light input fields

                // Accent colors - ROSA only (no gold)
                'accent-pink': '#FF4D6D', // Primary accent (ROSA)
                'accent-pink-dark': '#E91E63', // Hover/active state

                // Text colors
                'text-primary': '#F8FAFC', // Off-white
                'text-secondary': '#94A3B8', // Grey-blue
                'text-tertiary': '#6B7280', // Lighter grey
                'text-dark': '#0F172A', // For inputs on light bg
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'sans-serif'], // For "Hair Style" title if we add font later
            },
            borderRadius: {
                'pill': '9999px',
                'card': '16px',
                'input': '12px',
                'button': '28px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            fontSize: {
                'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
                'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
                'h4': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
            },
        },
    },
    plugins: [],
};
