const { whiteLableBrandData } = require('./common/whitelable');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@storefront-ui/react/**/*.{js,mjs}',
  ],
  daisyui: {
    themes: ["light"],
  },
  theme: {
    extend: {
      // backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic':
      //     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
      colors: {
        'extraa-blue': '#421C4D',
        'extraa-dark-purple': '#421C4D',
        'extraa-purple-btn': whiteLableBrandData?.primaryColor, //btn bg color 
        'extraa-yellow': '#FEC447',
        'extraa-card-bg': '#F6EEF9',
        'extraa-delite-bg': "#ac68f7",
        'MFC-gray':"#B8B9BB",
        "MFC-black":"#46443F", //changing to white color 
        "MFC-White":"##FFFFFF", //changing black color
        "MFC-slate-white":"#FBFCF8",
        "Zoominfo-text-button":whiteLableBrandData?.secondaryColor//Btn text_white

      }
    },
  },
  plugins: [
    require("daisyui")
  ],
};
