const path = require('path');

module.exports = {
  entry: './index.js',
  node: {
    __filename: false,
    __dirname: false,
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules|cli.js|examples/,
      query: {
        presets: ['es2015', 'env', 'stage-2'],
      },
    }],
  },
  devtool: 'source-map',
};
