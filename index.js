/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: "https://6bf24cd4567c16b1d555a7cc19b009d3@o4511586170568704.ingest.de.sentry.io/4511586186559568",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  },
  tracesSampleRate: 1.0,
});

// const container = document.getElementById("app");
// const root = createRoot(container);
// root.render(<App />);

AppRegistry.registerComponent(appName, () => App);