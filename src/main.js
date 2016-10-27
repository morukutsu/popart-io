/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';
//import 'babel-preset-es2017/polyfill';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './common/components/App';

// Base styling
import './common/base.css';

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

// DEBUG: react dev tools
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

/*console.log(REACT_DEVELOPER_TOOLS);
installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));*/

// Render the router
ReactDOM.render(
    <AppContainer>
        <App/>
    </AppContainer>,
    document.getElementById(DOM_APP_EL_ID)
);

if (module.hot) {
    module.hot.accept('./common/components/App', () => {
        const NextApp = require('./common/components/App').default;

        ReactDOM.render(
            <AppContainer>
                <NextApp/>
            </AppContainer>,
            document.getElementById(DOM_APP_EL_ID)
        );
    });
}
