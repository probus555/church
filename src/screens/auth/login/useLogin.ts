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
import {useLazyLoginQuery} from '../../../redux/services/auth/login/LoginApiSlice';

export interface Errors {
  loginId: string;
  password: string;
}

export interface CustomerData extends Errors {}

const useLogin = () => {
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
        dispatch(setEmployeeDetails(details.data));
        navigation.replace(screenNames.myWebView);
        // navigation.navigate('MyWebView');
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








