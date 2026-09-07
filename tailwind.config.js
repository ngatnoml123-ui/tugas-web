/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                    DEFAULT: '#2563eb',
                },
                accent: {
                    DEFAULT: '#0ea5e9',
                    light: '#38bdf8',
                    dark: '#0284c7',
                },
                saka: {
                    blue: '#2563EB',
                    'blue-dark': '#1d4ed8',
                    'blue-light': '#60a5fa',
                    white: '#ffffff',
                    gray: '#f8fafc',
                },
                status: {
                    draft:      '#94a3b8',
                    submitted:  '#f59e0b',
                    revision:   '#ef4444',
                    approved:   '#10b981',
                    published:  '#2563eb',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.05)',
                'card-hover': '0 4px 12px 0 rgba(37,99,235,.12)',
            },
            borderRadius: {
                'xl2': '1rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
