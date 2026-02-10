/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Background colors
                'bg-primary': '#0F0F0F',
                'bg-secondary': '#1C1C1E',
                'bg-tertiary': '#2C2C2E',

                // Accent colors
                'accent-gold': '#DCCAAB',
                'accent-gold-dark': '#C4B093',
                'accent-green': '#10B981',
                'accent-red': '#EF4444',
                'accent-yellow': '#F59E0B',

                // Text colors
                'text-primary': '#FFFFFF',
                'text-secondary': '#9CA3AF',
                'text-tertiary': '#6B7280',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'pill': '9999px',
                'card': '24px',
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
