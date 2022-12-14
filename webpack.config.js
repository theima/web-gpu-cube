const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      },
      {
        test: /\.(wgsl|glsl|vs|fs)$/,
        loader: 'ts-shader-loader',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
    },
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
