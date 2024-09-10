import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SplashScreen from '../../screens/splash';
import Login from '../../screens/auth/login';
import SignUp from '../../screens/auth/signUp';
import Profile from '../../screens/profile';
import SettingScreen from '../../screens/setting';
import CreatePostScreen from '../../screens/community/components/createPost';
import BottomNavigator from '../bottomNavigator';
import NotificationScreen from '../../screens/notification';
import EditProfileScreen from '../../screens/editProfile';
// import Home from '../../screens/home';

import MyWebView from '../../components/webView';
import {useAppTheme} from '../../theme';
import Header from './components/header';
import {RootStackParamList, screenNames} from './types';
import {Text} from 'react-native-paper';


type Props = {};

const RootNavigator = (props: Props) => {
  const Stack = createStackNavigator<RootStackParamList>();
  const theme = useAppTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: Header,
        }}>
        <Stack.Screen
          name={screenNames.splashScreen}
          options={{headerShown: false}}
          component={SplashScreen}
        />
        <Stack.Screen
          name={screenNames.login}
          options={{headerShown: false}}
          component={Login}
        />
        <Stack.Screen
          name={screenNames.signup}
          options={{headerShown: false}}
          // options={{title: 'Registration'}}
          component={SignUp}
        />
        {/* <Stack.Screen
          name={screenNames.profile}
          options={{headerShown: false}}
          component={Profile}
        /> */}
           <Stack.Screen
        name={screenNames.profile}
        options={{title: 'Profile', headerShown: false}}
        component={Profile}
      />
        <Stack.Screen
          name={screenNames.settingScreen}
          options={{title: 'Preferences'}}
          component={SettingScreen}
        />
            <Stack.Screen
        name={screenNames.myWebView}
        options={{headerShown: false}}
        component={BottomNavigator}
      />
              <Stack.Screen
        name={screenNames.createPost}
        options={{title: 'Create Post'}}
        component={CreatePostScreen}
      />
           <Stack.Screen
        name={screenNames.notificationScreen}
        options={{title: 'Notifications'}}
        component={NotificationScreen}
      />
            <Stack.Screen
        name={screenNames.editProfileScreen}
        options={{title: 'Edit Profile'}}
        component={EditProfileScreen}
      />
        {/* <Stack.Screen
          name={screenNames.myWebView}
          options={{headerShown: false}}
          component={MyWebView}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
