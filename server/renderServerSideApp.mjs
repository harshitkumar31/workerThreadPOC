import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import ReactRouterDom from 'react-router-dom';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import webpackLoadable from 'react-loadable/webpack.js';
// import App from '../lib/components/App.js';
import renderFetchData from './fetchDataForRender.js';
import IHtml from './indexHtml.js';
// import stats from '../build/react-loadable.json';
import ServerDataContext from '../src/state/serverDataContext.js';
import { Worker } from "worker_threads";
import * as Comlink  from 'comlink/dist/esm/comlink.mjs';
import nodeAdapter from 'comlink/dist/esm/node-adapter.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const fetchDataForRender = renderFetchData.fetchDataForRender;
const ServerDataProvider = ServerDataContext.ServerDataProvider;
const StaticRouter = ReactRouterDom.StaticRouter;
const getBundles = webpackLoadable.getBundles;
const indexHtml = IHtml.indexHtml;


const __dirname = dirname(fileURLToPath(import.meta.url));
const worker = new Worker(__dirname+'/renderWorker.mjs');
const workerRenderer = Comlink.wrap(nodeAdapter(worker));

var App = function App() {
  return React.createElement("div", null, "Hello WOrld");
};

var ServerApp = function ServerApp(_ref) {
  var context = _ref.context,
      data = _ref.data,
      location = _ref.location;
  return React.createElement(ServerDataProvider, {
    value: data
  }, React.createElement(StaticRouter, {
    location: location,
    context: context
  }, React.createElement(App, null)));
};

export const renderServerSideApp = async(req, res) => {
  Loadable.preloadAll()
    .then(async() => fetchDataForRender(ServerApp, req))
    .then(async(data)=> await renderApp(ServerApp, data, req, res));
};

async function renderApp(ServerApp, data, req, res) {
  const modules = [];

  

  const renderResponse = await workerRenderer.render(req.url, data);
  const markup = renderResponse.html;
  const context = renderResponse.context;

  const fullMarkup = indexHtml({
    helmet: '',
    serverData: data,
    // bundles: getBundles(stats, modules),
    markup
  });

  res.status(200).send(fullMarkup);
}
