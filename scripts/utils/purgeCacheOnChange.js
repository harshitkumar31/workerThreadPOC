/* eslint-disable no-console */

const chokidar = require('chokidar');

const purgeCacheOnChange = path => {
  const watcher = chokidar.watch(path, {
    ignoreInitial: true,
    ignored: /\/(node_modules|build)\//
  });

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Reloading server...');

      Object.keys(require.cache).forEach(id => {
        if (/[/\\](src|server)[/\\]/.test(id)) {
          delete require.cache[id];
        }
      });
    });
  });
};

module.exports = { purgeCacheOnChange };