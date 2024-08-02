// import {useState, useEffect} from 'react';
// import {Alert} from 'react-native';
// import {useAppDispatch} from '../../../redux/hooks/hooks';
// import {useNavigation} from '@react-navigation/native';
// import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
// import {checkValidation} from './helper';
// import {asyncStorageKeys} from '../../../common/constants';
// import {
//   RootStackParamList,
//   screenNames,
// } from '../../../navigation/rootNavigator/types';
// import {setEmployeeDetails} from '../../../redux/slices/emloyeeSlice';
// import {setSnackMessage} from '../../../redux/slices/snackbarSlice';
// import {useLazyGetUserDetailsQuery} from '../../../redux/services/user/userApiSlice';
// import {
//   useLazyLoginQuery,
//   useAddFCMMutation,
// } from '../../../redux/services/auth/login/LoginApiSlice';
// import initializeMessaging from '../../../common/utils/helper/FCM';

// export interface Errors {
//   loginId: string;
//   password: string;
// }

// export interface CustomerData extends Errors {}

// const useLogin = () => {
//   const [addFCMToken, addFCMTokenResult] = useAddFCMMutation();
//   const [loginUser, loginResult] = useLazyLoginQuery();
//   const [customerData, setCustomerData] = useState<CustomerData>({
//     loginId: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState<Errors>({loginId: '', password: ''});
//   const [getUserDetails, userDetailsResult] = useLazyGetUserDetailsQuery();
//   const [loginCredentials, setLoginCredintials] = useMMKVObject(
//     asyncStorageKeys.employeeCredintials,
//   );
//   const [employeeId, setEmployeeID] = useMMKVString(
//     asyncStorageKeys.employeeId,
//   );
//   const navigation = useNavigation<RootStackParamList>();
//   const dispatch = useAppDispatch();

//   const resetErrors = (newData: Partial<CustomerData>) => {
//     const updatedErrors = {} as Errors;
//     Object.keys(newData).forEach(key => {
//       updatedErrors[key as keyof Errors] = '';
//     });
//     setErrors(updatedErrors);
//   };

//   const updateCustomerData = (newData: Partial<CustomerData>) => {
//     resetErrors(newData);
//     setCustomerData(prevData => ({...prevData, ...newData}));
//   };

//   const saveLoginCredintials = async (data: CustomerData) => {
//     setLoginCredintials(customerData);
//   };

//   const saveEmployeeIdToLocal = async (id: string) => {
//     console.log('employee id', id);
//     setEmployeeID(id);
//   };

//   const registerFCMServices = async () => {
//     try {
//       const {permissionGranted, token, error} = await initializeMessaging();
//       if (permissionGranted && token) {
//      const addTokenResponse= await addFCMToken({fcmTokens: token}).unwrap();
//      console.log('addTokenResponse',addTokenResponse);
//      console.log('FCMtoke', token);
//       }
    
//     } catch (error) {
//       console.error('An error occurred while registering FCM services:', error);
//       // You can handle the error here according to your application's logic
//     }
//   };

//   const handleLogin = async () => {
//     const validationErrors = checkValidation(customerData);
//     if (validationErrors) {
//       setErrors(validationErrors);
//     } else {
//       let response;
//       try {
//         const response = await loginUser(customerData).unwrap();
//         console.log('Login API response:', response);

//         if (!response || !response.data) {
//           throw new Error('Invalid API response');
//         }

//         await saveLoginCredintials(customerData);
//         await saveEmployeeIdToLocal(response.data.employeeId.toString());

//         const details = await getUserDetails(
//           response.data.employeeId.toString(),
//         ).unwrap();
//         console.log('User details response:', details);
//         // await saveEmployeeDetails(response?.data?.employeeId, details.data);
//         dispatch(setEmployeeDetails(details?.data));

//         // Call registerFCMServices after successful login
//         await registerFCMServices();
//         navigation.replace(screenNames.myWebView, {
//           userId: response.data.employeeId.toString(),
//         });

//         // navigation.replace(screenNames.myWebView);
//         // navigation.navigate('MyWebView');
//       } catch (err) {
//         let errorMessage = 'An error occurred';
//         if (err?.data?.message) {
//           errorMessage = err.data.message;
//         } else if (err?.error) {
//           errorMessage = err.error;
//         }
//         dispatch(setSnackMessage(errorMessage));
//         console.error('Login error', err);
//       }
//     }
//   };

 
  
//   return {
//     customerData,
//     updateCustomerData,
//     errors,
//     handleLogin,
//     loginResult,
//   };
// };

// export default useLogin;


import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {useAppDispatch} from '../../../redux/hooks/hooks';
import {useNavigation} from '@react-navigation/native';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {checkValidation} from './helper';
import {asyncStorageKeys} from '../../../common/constants';
import {
  RootStackParamList,
  screenNames,
} from '../../../navigation/rootNavigator/types';
import {setEmployeeDetails} from '../../../redux/slices/emloyeeSlice';
import {setSnackMessage} from '../../../redux/slices/snackbarSlice';
import {useLazyGetUserDetailsQuery} from '../../../redux/services/user/userApiSlice';
import {
  useLazyLoginQuery,
  useAddFCMMutation,
} from '../../../redux/services/auth/login/LoginApiSlice';
import initializeMessaging from '../../../common/utils/helper/FCM';
import axios from 'axios';

export interface Errors {
  loginId: string;
  password: string;
}

export interface CustomerData extends Errors {}

const useLogin = () => {
  const [addFCMToken, addFCMTokenResult] = useAddFCMMutation();
  const [loginUser, loginResult] = useLazyLoginQuery();
  const [customerData, setCustomerData] = useState<CustomerData>({
    loginId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({loginId: '', password: ''});
  const [getUserDetails, userDetailsResult] = useLazyGetUserDetailsQuery();
  const [loginCredentials, setLoginCredintials] = useMMKVObject(
    asyncStorageKeys.employeeCredintials,
  );
  const [employeeId, setEmployeeID] = useMMKVString(
    asyncStorageKeys.employeeId,
  );
  const navigation = useNavigation<RootStackParamList>();
  const dispatch = useAppDispatch();

  const resetErrors = (newData: Partial<CustomerData>) => {
    const updatedErrors = {} as Errors;
    Object.keys(newData).forEach(key => {
      updatedErrors[key as keyof Errors] = '';
    });
    setErrors(updatedErrors);
  };

  const updateCustomerData = (newData: Partial<CustomerData>) => {
    resetErrors(newData);
    setCustomerData(prevData => ({...prevData, ...newData}));
  };

  const saveLoginCredintials = async (data: CustomerData) => {
    setLoginCredintials(customerData);
  };

  const saveEmployeeIdToLocal = async (id: string) => {
    console.log('employee id', id);
    setEmployeeID(id);
  };

  const registerFCMServices = async () => {
    try {
      const {permissionGranted, token, error} = await initializeMessaging();
      if (permissionGranted && token) {
        const addTokenResponse = await addFCMToken({fcmTokens: token}).unwrap();
        console.log('addTokenResponse', addTokenResponse);
        console.log('FCMtoken', token);
      }
    } catch (error) {
      console.error('An error occurred while registering FCM services:', error);
    }
  };

  const sendNotification = async () => {
    
    const requestBody = {
      Title: 'New Notice',
      Body: 'You Have Received New Notice.',
      Data: { "screenName": "http://church.stealthems.in/Individuals/Individuals/NoticeList",
        "type": "notice"} // Replace with actual data if needed
    };
  
    try {
      const response = await axios.post(
        'http://49.248.250.54:8081/api/sendnotice',
        requestBody,
        {
          headers: {
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Notification API responsejhgfdsdfg:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending notification:', error.response?.data);
      } else {
        console.error('Error sending notification:', error);
      }
    }
  };
  
  const handleLogin = async () => {
    const validationErrors = checkValidation(customerData);
    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await loginUser(customerData).unwrap();
        console.log('Login API response:', response);

        if (!response || !response.data) {
          throw new Error('Invalid API response');
        }

        await saveLoginCredintials(customerData);
        await saveEmployeeIdToLocal(response.data.employeeId.toString());

        const details = await getUserDetails(
          response.data.employeeId.toString(),
        ).unwrap();
        console.log('User details response:', details);
        dispatch(setEmployeeDetails(details?.data));

        if (details.data.role === 'Individual') {
          await sendNotification();
        }

        await registerFCMServices();
        navigation.replace(screenNames.myWebView, {
          userId: response.data.employeeId.toString(),
        });
      } catch (err) {
        let errorMessage = 'An error occurred';
        if (err?.data?.message) {
          errorMessage = err.data.message;
        } else if (err?.error) {
          errorMessage = err.error;
        }
        dispatch(setSnackMessage(errorMessage));
        console.error('Login error', err);
      }
    }
  };

  return {
    customerData,
    updateCustomerData,
    errors,
    handleLogin,
    loginResult,
  };
};

export default useLogin;

