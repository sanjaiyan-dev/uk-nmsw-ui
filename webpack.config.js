const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    css: path.resolve(__dirname, 'src/assets/main.scss'),
    Templates: path.resolve(__dirname, 'src/pages/NavPages/Templates.jsx'), // templates page rarely change so can be served from cache most of the time
  },
  output: {
    filename: '[contenthash:8].bundle.js',
    chunkFilename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
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
          { loader: 'style-loader' },
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
  ],
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
