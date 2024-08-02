

import React, {useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import autoLoginUtil from '../../components/webView/helper';
import Header from './header';
import HeaderSecond from './headerSecond';
import {screenNames} from '../../navigation/rootNavigator/types';
import {useMMKVObject} from 'react-native-mmkv';
import {asyncStorageKeys} from '../../common/constants';

const AutoLoginWebView = () => {
  const webViewRef = useRef(null);
  const route = useRoute();
  const {screenName} = route.params || {};
  // const  {screenName} = useRoute().params
  // const { screenName } = route.params as { screenName: string }; 
  const isFocused = useIsFocused();
  console.log('screenNameName', screenName);

  const navigation = useNavigation();
  const [userCredintials, setUserCredintials] = useMMKVObject(
    asyncStorageKeys.employeeCredintials,
  );

  useEffect(() => {
    if (isFocused) {
      console.log('route.params', route.params);
    }
  }, [route.params, isFocused]);
  console.log(userCredintials);
  // const route = useRoute();
  // const {userId} = route.params; // Get userId from route parameters
  // const {setUserId} = route.params; // Get setUserId function from params

  // Extract loginId and password from route params
  // const {loginId, password} = route.params || {};
  // console.log(loginId, password);
  // useEffect(() => {
  //   if (userId) {
  //     setUserId(userId);

  //     // Navigate to MyWebView screen with userId as a parameter
  //     navigation.replace(screenNames.profile, {userId});
  //   }
  // }, [userId, setUserId, navigation]);

  // Generate the injected JavaScript with the provided username and password
  const injectedJavaScript = autoLoginUtil(
    userCredintials?.loginId,
    userCredintials?.password,
  );

  const onMessage = event => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  const onShouldStartLoadWithRequest = request => {
    // Handle any custom URL schemes or conditions here
    return true;
  };

  const onReceivedSslError = event => {
    // This function will handle SSL certificate errors
    const {url, code, message} = event.nativeEvent;
    Alert.alert(
      'SSL Certificate Error',
      `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
      [
        {
          text: 'Cancel',
          onPress: () => event.nativeEvent.preventDefault(),
          style: 'cancel',
        },
        {
          text: 'Proceed',
          onPress: () => event.nativeEvent.proceed(),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <WebView
        ref={webViewRef}
        // source={{
        //   uri: 'http://church.stealthems.in',
        // }}
        source={{
          uri: screenName
            ?screenName
            : 'http://church.stealthems.in',
        }}
        // source={{ uri: 'https://church.stealthems.in/Leader/Leader/Dashboard' }}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onReceivedSslError={onReceivedSslError}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AutoLoginWebView;
