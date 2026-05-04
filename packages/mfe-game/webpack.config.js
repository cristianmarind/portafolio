const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  output: { path: path.resolve(__dirname, 'dist'), publicPath: 'auto', clean: true },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    extensionAlias: { '.js': ['.ts', '.js'] },
    alias: { '@portfolio/shared': path.resolve(__dirname, '../shared/src/index.ts') },
  },
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.ts$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true, appendTsSuffixTo: [/\.vue$/] } },
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'mfeGame',
      filename: 'remoteEntry.js',
      exposes: { './mount': './src/mount' },
      shared: { vue: { singleton: true, strictVersion: false, requiredVersion: '^3.0.0' } },
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  devServer: { port: 3006, host: '0.0.0.0', hot: true, headers: { 'Access-Control-Allow-Origin': '*' } },
  devtool: argv.mode === 'development' ? 'source-map' : false,
});
