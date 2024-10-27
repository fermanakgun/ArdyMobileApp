/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF', // Primary renginizi burada belirleyin
  },
};

// Tüm uygulama genelinde `Ionicons` ikon setini kullanabilmesi için `PaperProvider` ile sarın
const Main = () => (
  <PaperProvider
    theme={theme}
    settings={{
      icon: (props) => <Ionicons {...props} />,
    }}
  >
    <App />
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);
