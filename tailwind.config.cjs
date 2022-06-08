const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			serif: ['Bespoke Serif', ...defaultTheme.fontFamily.serif],
			sans: ['Bespoke Sans', ...defaultTheme.fontFamily.sans]
		},
		extend: {
			fontFamily: {
				heading: ['Bespoke Slab', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
