import {useEffect} from 'react';
// import useAsyncStorage from '../../hooks/useAsyncStorage';
import {useNavigation} from '@react-navigation/native';
import {
  NavigationActionType,
  RootStackParamList,
  screenNames,
} from '../../navigation/rootNavigator/types';
import {asyncStorageKeys} from '../../common/constants';
import {useAppDispatch} from '../../redux/hooks/hooks';
import {
  setEmployeeDetails,
  setEmployeeId,
  setMpin,
} from '../../redux/slices/emloyeeSlice';
// import {getEmployeeDetails} from '../../services/sqlite/employee';
// import {getEmployeeMPIN} from '../../services/sqlite/mpin';
import {useLazyLoginQuery, useAddFCMMutation,} from '../../redux/services/auth/login/LoginApiSlice';
import {useMMKV, useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {setPinMode} from '../../redux/slices/pinSlice';
import {PinCodeT} from '@anhnch/react-native-pincode';
import {storage} from '../../services/mmkvStorgae';
import {CustomerData} from '../auth/login/useLogin';
import {useLazyGetUserDetailsQuery} from '../../redux/services/user/userApiSlice';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';
// import useMessaging from '../../hooks/useFCM';
import initializeMessaging from '../../common/utils/helper/FCM';

const useSplash = () => {
    // const [addFCMToken, addFCMTokenResult] = useAddFCMMutation();
  //   const asyncStorage = useAsyncStorage();
  const navigation = useNavigation<NavigationActionType>();
  const dispatch = useAppDispatch();
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
        const loginResponse = await loginUser(loginCredentials, true).unwrap();
        return loginResponse;
      }
    } catch (error) {
      console.log('Error occurred while auto-login:', error);
      throw error;
    }
  };

    // const registerFCMServices = async () => {
    //   try {
    //     const {permissionGranted, token, error} = await initializeMessaging();
    //     console.log('token', token);
    //     if (permissionGranted && token) {
    //       await addFCMToken({fcmTokens: token});
    //     }
    //   } catch (error) {
    //     console.error('An error occurred while registering FCM services:', error);
    //     // You can handle the error here according to your application's logic
    //   }
    // };

    // console.log(addFCMTokenResult);

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
        // await registerFCMServices();
        if (employeeId) {
        const  employeeData = await getUserDetails(employeeId).unwrap();
        console.log('employeeData ', employeeData)
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

  const handleSplash = async () => {
    try {
      if (!employeeId) {
        navigation.replace(screenNames.login);
        return;
      }
      await handleAutoLogin();
    } catch (error) {
      console.error('Error occurred while navigating:', error);
      navigation.replace(screenNames.login); // Navigate to login screen on error
    }
  };
};

export default useSplash;











