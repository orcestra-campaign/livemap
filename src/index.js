import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import eurec4a_reducer from './reducers.js';
import { logger } from './middleware.js';

import { createClient } from './lib/mqttredux';

const mqttConfig = {
  url: 'wss://mqtt.eurec4a.eu:9002/mqtt',
  opt: {
    clientId: 'dashboard-redux-' + Date.now(),
    username: "dashboard",
    password: "dashboard",
  },
};

const mqttRedux = createClient(mqttConfig);

const store = createStore(
    eurec4a_reducer,
    applyMiddleware(logger, mqttRedux.createMiddleware()),
);

const actionTopicMapping = [
    { action: 'PLATFORM_META',
      topic: 'platform/+/meta',
      decoder: JSON.parse },
    { action: 'PLATFORM_LOCATION',
      topic: 'platform/+/location',
      decoder: JSON.parse},
];

mqttRedux.connect(actionTopicMapping, store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
