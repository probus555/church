/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {handleFirebaseMessage} from './src/common/utils/helper/FCM';
messaging().onMessage(handleFirebaseMessage);
messaging().setBackgroundMessageHandler(handleFirebaseMessage);



AppRegistry.registerComponent(appName, () => App);
