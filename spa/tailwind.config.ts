import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    // './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout': 'var(--sidebar-width) auto'
      },
      gridTemplateRows: {
        'layout': 'var(--header-height) auto'
      },
      padding: {
        'layout': '1.2rem'
      }
    }
  },
  plugins: [],
} satisfies Config
