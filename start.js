// Server-side entrypoint that registers Babel's require() hook
require('react-hot-loader/patch');
const babelRegister = require('babel-register');
babelRegister();

require('./server');
