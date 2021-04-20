const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    publicPath: 'http://localhost:8080/',
    compress: true,
    historyApiFallback: true,
    watchOptions: {
      poll: true,
      aggregateTimeout: 1000,
    },
    stats: 'minimal',
    hot: true,
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'window.env.GOOGLE_API_KEY': `"${process.env.GOOGLE_API_KEY}"`,
    }),
  ],
});
