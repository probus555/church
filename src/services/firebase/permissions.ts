import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {isAndroid, isIos} from '../../common/utils/config';

class PermissionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

const requestUserPermission = async (): Promise<void> => {
  try {
    if (isAndroid) {
      await requestAndroidPermission();
    } else if (isIos) {
      await requestIOSPermission();
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
    throw new PermissionError('Error requesting permission');
  }
};

const requestAndroidPermission = async (): Promise<void> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'Allow this app to access notifications?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        'Permission Denied',
        'You need to grant notification permission for this app to function properly.',
      );
      throw new PermissionError('Permission denied');
    }
  } catch (error) {
    console.error('Error requesting Android permission:', error);
    throw new PermissionError('Error requesting Android permission');
  }
};

const requestIOSPermission = async (): Promise<void> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      Alert.alert(
        'Permission Denied',
        'You need to grant notification permission for this app to function properly.',
      );
      throw new PermissionError('Permission denied');
    }
  } catch (error) {
    console.error('Error requesting iOS permission:', error);
    throw new PermissionError('Error requesting iOS permission');
  }
};

const checkPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return enabled;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

const createNotificationChannel = (): void => {
  // You can create notification channels here for Android
};

export {
  requestUserPermission,
  checkPermission,
  createNotificationChannel,
  PermissionError,
};
