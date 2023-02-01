const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: ['./src/index.js', './src/assets/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 1024000,
  },
  resolve: {
    alias: {
      '/assets': path.resolve(__dirname, 'node_modules/govuk-frontend/govuk/assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: [
          { loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader }, // Creates `style` nodes from JS strings
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                quietDeps: true, // https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#silence-deprecation-warnings-from-dependencies-in-dart-sass
              },
            },
          },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new Dotenv({ systemvars: true }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: './src/assets/images/favicon.ico',
    }),
    new CopyPlugin(
      {
        patterns: [
          { from: 'node_modules/govuk-frontend/govuk/all.js', to: 'javascript/all.js' },
          { from: 'node_modules/govuk-frontend/govuk/assets', to: 'assets' },
          { from: 'src/assets/images', to: 'assets/images' },
          { from: 'src/assets/css', to: 'assets/css' },
          { from: 'src/assets/files', to: 'assets/files' },
        ],
      },
    ),
    // This allows to pass env vars on runtime, see /nginx/run.sh and Dockerfile
    new webpack.EnvironmentPlugin({
      NMSW_DATA_API_BASE_URL: 'http://localhost:5000',
    }),
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: '[name]-[hash].css',
    chunkFilename: '[id]-[hash].css',
  })]),
  devServer: {
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
  },

};
