const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const autoPreprocess = require('svelte-preprocess');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

// purgecss({
//   content: ["./**/*.svelte", "./**/*.html"],
//   defaultExtractor: content => {
//     const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g);

//     const matchedTokens = [];

//     let match = regExp.exec(content);

//     while (match) {
//         if (match[0].startsWith('class:')) {
//             matchedTokens.push(match[0].substring(6));
//         } else {
//             matchedTokens.push(match[0]);
//         }

//         match = regExp.exec(content);
//     }

//     return matchedTokens;
//   }
// })

const sveltPreprocess = autoPreprocess({
  postcss: true,
  scss: false,
  stylus: false,
  typescript: false,
  coffeescript: false,
  less: false,
  pug: false
});

module.exports = {
  entry: {
    bundle: ['./src/main.js']
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: sveltPreprocess,
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader',
      //   options: {
      //     removeSVGTagAttrs: true
      //   }
      // }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devtool: prod ? false : 'source-map'
};
