const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: { '.js': ['.ts', '.tsx', '.js'] },
    alias: {
      '@portfolio/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeExperience',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount',
      },
      shared: {
        react: { singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
        gsap: { singleton: true, strictVersion: false, requiredVersion: '^3.12.0' },
      },
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  devServer: {
    port: 3002,
    host: '0.0.0.0',
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  devtool: argv.mode === 'development' ? 'source-map' : false,
});
