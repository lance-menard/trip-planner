const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

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
  plugins: [
    new webpack.DefinePlugin({
      'window.env.GOOGLE_API_KEY': `"${process.env.GOOGLE_API_KEY}"`,
    }),
  ],
});
