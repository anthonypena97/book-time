import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker.js';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

reportWebVitals();
serviceWorker.register();
