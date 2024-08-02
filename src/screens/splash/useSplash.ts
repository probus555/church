import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationActionType, screenNames } from '../../navigation/rootNavigator/types';
import { asyncStorageKeys } from '../../common/constants';
import { useAppDispatch } from '../../redux/hooks/hooks';
import {
  setEmployeeDetails,
  setEmployeeId,
  setMpin,
} from '../../redux/slices/emloyeeSlice';
import {useLazyGetUserDetailsQuery} from '../../redux/services/user/userApiSlice';
import { useMMKV, useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { setPinMode } from '../../redux/slices/pinSlice';
import { PinCodeT } from '@anhnch/react-native-pincode';
import { storage } from '../../services/mmkvStorgae';
import { CustomerData } from '../auth/login/useLogin';
import { setSnackMessage } from '../../redux/slices/snackbarSlice';
import { requestUserPermission } from '../../services/firebase/permissions';
import { useLazyLoginQuery,  useAddFCMMutation, } from '../../redux/services/auth/login/LoginApiSlice';
import initializeMessaging from '../../common/utils/helper/FCM';

const useSplash = () => {
  const navigation = useNavigation<NavigationActionType>();
  const dispatch = useAppDispatch();
  const [addFCMToken, addFCMTokenResult] = useAddFCMMutation();
  const [loginUser, loginResult] = useLazyLoginQuery();
  const [getUserDetails, userDetailsResult] = useLazyGetUserDetailsQuery();
  const [pin, setPin] = useMMKVString(asyncStorageKeys.pin);
  const [loginCredentials, setLoginCredintials] = useMMKVObject<CustomerData>(
    asyncStorageKeys.employeeCredintials,
  );
  const [employeeId, setEmployeeID] = useMMKVString(
    asyncStorageKeys.employeeId,
  );

  useEffect(() => {
    handleSplash();
  }, []);

  
  const autoLoginUser = async () => {
    try {
      if (loginCredentials) {
        console.log('Login credentials:', loginCredentials);
        const loginResponse = await loginUser(loginCredentials, true).unwrap();
        console.log('Login response:', loginResponse);
        return loginResponse;
      } else {
        console.log('No login credentials found');
      }
    } catch (error) {
      console.log('Error occurred while auto-login:', error);
      throw error;
    }
  };

  const handlePinType = () => {
    if (pin?.length > 0) {
      dispatch(setPinMode(PinCodeT.Modes.Enter));
    } else {
      navigation.replace(screenNames.login);
    }
  };

  const handleAutoLogin = async () => {
    try {
      const loginResponse = await autoLoginUser();
      if (loginResponse) {
        await registerFCMServices();
        if (employeeId) {
          const employeeData = await getUserDetails(employeeId).unwrap();
          console.log('employeeData ', employeeData);
          if (employeeData) {
            dispatch(setEmployeeId(employeeId));
            dispatch(setEmployeeDetails(employeeData.data));
            handlePinType();
            navigation.replace(screenNames.myWebView);
            return;
          } else {
            navigation.replace(screenNames.login);
          }
        }
      }
    } catch (err) {
      console.log('error auto login', err);
      dispatch(setSnackMessage(err?.error?.toString()));
      navigation.replace(screenNames.login);
    }
  };

  const registerFCMServices = async () => {
    try {
      const {permissionGranted, token, error} = await initializeMessaging();
      console.log('token', token);
      if (permissionGranted && token) {
        await addFCMToken({fcmTokens: token});
      }
    } catch (error) {
      console.error('An error occurred while registering FCM services:', error);
      // You can handle the error here according to your application's logic
    }
  };


  const handleSplash = async () => {
    try {
      // await requestUserPermission();
      if (!employeeId) {
        navigation.replace(screenNames.login);
        return;
      }
      await handleAutoLogin();
    } catch (error) {
      console.error('Error occurred while navigating:', error);
      navigation.replace(screenNames.login);
    }
  };
};

export default useSplash;













