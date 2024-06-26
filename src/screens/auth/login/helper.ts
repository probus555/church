import {CustomerData, Errors} from './useLogin';

const checkValidation = (customerData: CustomerData) => {
  const newErrors: Errors = {customerCode: '', loginId: '', password: ''};

  if (!customerData.loginId) {
    newErrors.loginId = 'Login Id is required';
  }
  if (!customerData.password) {
    newErrors.password = 'Password is required';
  }

  if (Object.values(newErrors).some(value => value)) {
    return newErrors;
  }
  return null;
};

export {checkValidation};
