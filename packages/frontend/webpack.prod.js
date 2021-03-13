const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 8,
          parallel: false,
        },
      }),
    ],
  },
  plugins: [],
});
