import {useEffect, useState} from 'react';
import {useAppSelector} from '../../redux/hooks/hooks';
import {
  useGetUserDetailsQuery,
  useLazyGetUserDetailsQuery,
} from '../../redux/services/user/userApiSlice';
import {setEmployeeDetails} from '../../redux/slices/emloyeeSlice';
import {UserDetails} from '../../redux/services/user/types';

const useProfile = (userId: string) => {
  const {employeeDetails} = useAppSelector(state => state.employee);
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [getUserDetails, userDetailsResult] = useLazyGetUserDetailsQuery();
console.log('userId',userId)
  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setUserDetails(employeeDetails);
    }
  }, [employeeDetails, userId]);

  const fetchUserDetails = async () => {
    const userData = await getUserDetails(userId).unwrap();

    if (userData?.data) {
      setUserDetails(userData.data);
    }
  };

  return {userDetails};
};
export default useProfile;
