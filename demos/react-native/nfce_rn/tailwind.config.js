/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/screens/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'blue': {
                    500: '#08678C',
                    600: '#074973',
                    700: '#032859',
                    800: '#011C40',
                    900: '#011126',
                }
            }
        },
    },
    presets: [require("nativewind/preset")],
}
