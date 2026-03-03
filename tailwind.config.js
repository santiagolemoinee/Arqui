/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#20316d",
                lebane: "#20316d",
                "secondary-light": "#aebfff",
                accent: "#535353",
                background: "#FBFBFE",
                surface: "#F9FAFB",
                "text-primary": "#111827",
                "text-secondary": "#6B7280",
                violet: "#7B61FF",
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1.5rem',
            },
            boxShadow: {
                'premium': '0 10px 40px rgba(0, 0, 0, 0.04)',
            }
        },
    },
    plugins: [],
}
