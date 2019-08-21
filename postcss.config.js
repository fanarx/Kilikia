const cssnano = require('cssnano');
const postcss_color_mod = require('postcss-color-mod-function');
const postcss_preset_env = require('postcss-preset-env');
const postcss_Url = require('postcss-url');
const purgecss = require('@fullhuman/postcss-purgecss');
const env = process.env.NODE_ENV;
const production = env === 'production';

console.log('+++production++', production);

module.exports = {
  plugins: [
    require('postcss-import'),
    postcss_Url(),
    require('tailwindcss'),
    postcss_preset_env({
      stage: 0,
      autoprefixer: {
        grid: true
      }
    }),
    postcss_color_mod(),
    cssnano({
      autoprefixer: false,
      preset: ['default']
    }),
    require('autoprefixer')
    // production &&
    //   purgecss({
    //     content: ['./**/*.html', './**/*.svelte'],
    //     defaultExtractor: content => {
    //       const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g);

    //       const matchedTokens = [];

    //       let match = regExp.exec(content);

    //       while (match) {
    //         if (match[0].startsWith('class:')) {
    //           matchedTokens.push(match[0].substring(6));
    //         } else {
    //           matchedTokens.push(match[0]);
    //         }

    //         match = regExp.exec(content);
    //       }

    //       return matchedTokens;
    //       // return content.match(/[A-Za-z0-9-_:/]+/g) || [];
    //       //return content;
    //     }
    //   })
  ]
};

// only needed if you want to purge
// const purgecss = require('@fullhuman/postcss-purgecss')({
//   content: ['./src/**/*.svelte', './public/**/*.html'],
//   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
// });

// module.exports = {
//   plugins: [
//     require('tailwindcss'),

//     // only needed if you want to purge
//     ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
//   ]
// };
