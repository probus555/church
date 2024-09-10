import {NavigationProp} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  SignUp: undefined;
  // Profile: undefined;
  profile: {userId: string; navigation: NavigationActionType};
  SettingScreen: undefined;
  // MyWebView: { screenName?: string };
  MyWebView: undefined;
  createPost:{title?:string, screenTitle:string, mode: 'create' | 'edit',description?:string,assets?:any[],postId:string},
  notificationScreen:undefined;
  editProfileScreen:undefined;
};

export const screenNames = {
  splashScreen: 'SplashScreen',
  login: 'Login',
  signup: 'SignUp',
  profile: 'profile',
  settingScreen: 'SettingScreen',
  myWebView: 'MyWebView',
  createPost:'createPost',
  notificationScreen:'notificationScreen',
  editProfileScreen:'editProfileScreen',
} as const;

export type NavigationActionType = NavigationProp<RootStackParamList>;

// Define the Route type for your RootStackParamList
export type Route = RouteProp<RootStackParamList, keyof RootStackParamList>;
