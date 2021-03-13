const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /(\.flow|\.md|\.ts|\.map|LICENSE)$/,
        use: ['ignore-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        include: [path.join(__dirname, 'src')],
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   // analyzerMode: 'server',
    //   analyzerMode: 'disabled',
    //   defaultSizes: 'parsed',
    // }),
    new HtmlWebpackPlugin({
      title: 'Trip Planner',
      template: './static/index.ejs',
    }),
    new FaviconsWebpackPlugin('./static/icon.png'),
  ],
  resolve: {
    externals: {
      google: 'google',
    },
    extensions: ['.mjs', '.js'],
    alias: {
      '~': path.join(__dirname, '/src'),
    },
  },
};
