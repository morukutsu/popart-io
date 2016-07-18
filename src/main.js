/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import App from './common/components/App';

// Base styling
import './common/base.css';

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

// Render the router
ReactDOM.render((
  <App />
), document.getElementById(DOM_APP_EL_ID));

/*
<Router history={browserHistory}>
  {Routes}
</Router>
*/
