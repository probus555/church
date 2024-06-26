import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {asyncStorageKeys} from '../../common/constants';
import {useAppDispatch} from '../../redux/hooks/hooks';
import {
  setEmployeeDetails,
  setEmployeeId,
} from '../../redux/slices/emloyeeSlice';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';
import {useLazyGetUserDetailsQuery} from '../../redux/services/user/userApiSlice';
import {CustomerData} from '../auth/login/useLogin';
import {
  NavigationActionType,
  screenNames,
} from '../../navigation/rootNavigator/types';
import {useAppTheme} from '../../theme';
import useStyles from './useStyles';
import useSplash from './useSplash';

import images from '../../asset/images';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';

const SplashScreen = () => {
  const theme = useAppTheme();
  useSplash();
  const styles = useStyles();

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      {/* <Image
        source={images.appImages.splash}
        style={styles.image}
        resizeMethod="auto"
        resizeMode="contain"
      /> */}
      <Text style={{color:'#ffffff',fontSize:34,fontWeight:'bold'}}>CHURCH</Text>
    </LinearGradient>
  );
};

export default SplashScreen;
