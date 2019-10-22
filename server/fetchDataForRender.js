const React = require('react');
const ssrPrepass = require('react-ssr-prepass');
const chalk = require('chalk');

const fetchDataForRender = (ServerApp, req) => {
  let data = {};

  return ssrPrepass(
    React.createElement(ServerApp, {
      data: data,
      location: req.url
    }),
    element => {
      if (element && element.type && element.type.fetchData) {
        return element.type.fetchData(req).then(d => {
          Object.keys(d).forEach(key => {
            if (data[key]) {
              logDuplicateKeyMessage(key, element.type.name);
            }
          });

          data = {
            ...data,
            ...d
          };
        });
      }
    }
  ).then(() => {
    return data;
  });
};

function logDuplicateKeyMessage(key, component) {
  /* eslint-disable no-console */
  console.log('');
  console.log(
    chalk.red(
      `Warning: <${component} /> is overwriting an existing server data value for "${key}".`
    )
  );
  console.log(chalk.red('This can cause unexpected behavior.'));
  console.log('');
}

module.exports = {
  fetchDataForRender
};
