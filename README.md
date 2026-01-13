npm i

Frond: 

npm install -D tailwindcss@3

npx tailwindcss init

npm install -D postcss autoprefixer

Creacion de tailwind.config.js =
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Creacion de postcss.config.js = 

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
