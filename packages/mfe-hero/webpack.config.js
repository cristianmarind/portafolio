const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.ts',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@portfolio/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeHero',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount.tsx',
      },
      shared: {
        react:        { singleton: true, requiredVersion: '^18.0.0', eager: false },
        'react-dom':  { singleton: true, requiredVersion: '^18.0.0', eager: false },
        gsap:         { singleton: true, requiredVersion: '^3.12.0'               },
        three:        { singleton: true, requiredVersion: '^0.167.0'              },
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  devServer: {
    port: 3001,
    host: '0.0.0.0',
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
