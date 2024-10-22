const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react'
  ],
  babelrc: false,
  configFile: false,
});
