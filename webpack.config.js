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
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: ['shebang-loader', 'babel-loader'],
      exclude: /node_modules|cli.js/,
    }],
  },
};
