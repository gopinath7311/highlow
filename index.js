/**
 * @format
 */
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/redux';
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
const RNRedux = () => (
<Provider store={store}>
    <App />
    </Provider>
);
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(RNRedux));
