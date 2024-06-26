import {NavigationProp} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  SignUp: undefined;
  // Profile: undefined;
  profile: {userId: string; navigation: NavigationActionType};
  SettingScreen: undefined;
  MyWebView: undefined;
  createPost:{title?:string, screenTitle:string, mode: 'create' | 'edit',description?:string,assets?:any[],postId:string},
};

export const screenNames = {
  splashScreen: 'SplashScreen',
  login: 'Login',
  signup: 'SignUp',
  profile: 'Profile',
  settingScreen: 'SettingScreen',
  myWebView: 'MyWebView',
  createPost:'createPost',
} as const;

export type NavigationActionType = NavigationProp<RootStackParamList>;

// Define the Route type for your RootStackParamList
export type Route = RouteProp<RootStackParamList, keyof RootStackParamList>;
