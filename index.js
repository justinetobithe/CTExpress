/**
 * @format
 */

import "react-native-gesture-handler";
import { AppRegistry } from 'react-native';
// import App from './App';
import App from './src/App';
import firebase from '@react-native-firebase/app';
import { name as appName } from './app.json';

if (!firebase.apps.length) {
    firebase.initializeApp();
} else {
    firebase.app();
}

AppRegistry.registerComponent(appName, () => App);
