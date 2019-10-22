const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const createConfig = require('../../config/webpackConfigFactory');

const config = createConfig('development');

const applyDevMiddleware = app => {
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      hot: true,
      publicPath: config.output.publicPath,
      progress: true,
      stats: {
        colors: true,
        assets: true,
        chunks: false,
        modules: false,
        hash: false
      }
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      path: '/__webpack_hmr',
      heartbeat: 4000
    })
  );
};

module.exports = { applyDevMiddleware };
