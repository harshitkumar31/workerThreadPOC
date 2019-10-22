import { parentPort, MessageChannel } from "worker_threads";
import ReactRouterDom from 'react-router-dom';
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';
import ServerDataContext from '../lib/state/serverDataContext.js';
import React from 'react';
import * as Comlink from 'comlink/dist/esm/comlink.mjs';
import ReactDOMServer from 'react-dom/server.js';
import Loadable from 'react-loadable';
const ServerDataProvider = ServerDataContext.ServerDataProvider;
const StaticRouter = ReactRouterDom.StaticRouter;

var App = function App() {
    return React.createElement("div", null, "Hello WOrld");
  };

  function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

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

Comlink.transferHandlers.set('proxy', {
	canHandle: obj => obj && obj[Comlink.proxyMarker],
	serialize: obj => {
		const { port1, port2 } = new MessageChannel()
		Comlink.expose(obj, nodeEndpoint(port1))
		return [port2, [port2]]
	},
	deserialize: port => {
		port = nodeEndpoint(port)
		port.start()
		return Comlink.wrap(port)
	}
})

const renderWorker = {
    doRender() {
        return 'Hi';
    },
    render(url, data) {
        let context = {};
        let modules = [];
        
        const html=  ReactDOMServer.renderToString(
            React.createElement(Loadable.Capture, {
              report: function report(moduleName) {
                return modules.push(moduleName);
              }
            }, React.createElement(ServerApp, {
              location: url,
              data: data,
              context: context
            }))
          );

          sleepFor(500);
        return {
            html,
            context
        }
    }

}

// Comlink.expose(renderWorker, nodeEndpoint(parentPort))
Comlink.expose(renderWorker, nodeEndpoint(parentPort))