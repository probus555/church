

// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Alert,
//   View,
//   Text,
//   ActivityIndicator,
//   BackHandler,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
// import autoLoginUtil from '../../components/webView/helper';
// import Header from './header';
// import { useMMKVObject } from 'react-native-mmkv';
// import { asyncStorageKeys } from '../../common/constants';
// import { Button } from 'react-native-paper';

// const AutoLoginWebView = () => {
//   const webViewRef = useRef(null);
//   const route = useRoute();
//   const { screenName } = route.params || {};
//   const isFocused = useIsFocused();
//   const navigation = useNavigation();
//   const [userCredintials] = useMMKVObject(asyncStorageKeys.employeeCredintials);
//   const [loginCredentials, setLoginCredentials] = useState(null);
//   const [error, setError] = useState(null);
//   const [canGoBack, setCanGoBack] = useState(false);

//   useEffect(() => {
//     if (isFocused) {
//       console.log('route.params', route.params);
//     }
//   }, [route.params, isFocused]);

//   useEffect(() => {
//     if (userCredintials) {
//       setLoginCredentials({
//         loginId: userCredintials.loginId,
//         password: userCredintials.password,
//       });
//     }
//   }, [userCredintials]);

//   const handleBackPress = useCallback(() => {
//     if (canGoBack) {
//       webViewRef.current.goBack();
//     } else {
//       Alert.alert(
//         'Exit App',
//         'Do you want to exit the app?',
//         [
//           {
//             text: 'No',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           { text: 'Yes', onPress: () => BackHandler.exitApp() },
//         ],
//         { cancelable: false }
//       );
//     }
//     return true;
//   }, [canGoBack]);

//   useEffect(() => {
//     BackHandler.addEventListener('hardwareBackPress', handleBackPress);
//     return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
//   }, [handleBackPress]);

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <Button mode="contained" onPress={() => setError(null)}>
//           Retry
//         </Button>
//       </View>
//     );
//   }

//   if (!loginCredentials) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   const { loginId, password } = loginCredentials;

//   const injectedJavaScript = autoLoginUtil(loginId, password);

//   const onMessage = (event) => {
//     console.log('Message from WebView:', event.nativeEvent.data);
//   };

//   const onShouldStartLoadWithRequest = (request) => {
//     // Handle any custom URL schemes or conditions here
//     return true;
//   };

//   const onReceivedSslError = (event) => {
//     const { url, code, message } = event.nativeEvent;
//     Alert.alert(
//       'SSL Certificate Error',
//       `An SSL error occurred: ${message} (${code}) for URL: ${url}. Do you want to proceed anyway?`,
//       [
//         {
//           text: 'Cancel',
//           onPress: () => event.nativeEvent.preventDefault(),
//           style: 'cancel',
//         },
//         {
//           text: 'Proceed',
//           onPress: () => event.nativeEvent.proceed(),
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   const dynamicUrl = `http://church.stealthems.in/Home/AppCall/?username=${loginId}&password=${password}`;

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header />
//       <WebView
//         ref={webViewRef}
//         source={{ uri: screenName || dynamicUrl }}
//         injectedJavaScript={injectedJavaScript}
//         onMessage={onMessage}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         startInLoadingState={true}
//         onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//         onReceivedSslError={onReceivedSslError}
//         onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
//       />
//       {/* {canGoBack && (
//         <Button
//           mode="contained"
//           style={styles.backButton}
//           onPress={() => webViewRef.current.goBack()}
//         >
//           Back
//         </Button>
//       )} */}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     margin: 20,
//   },
// });

// export default AutoLoginWebView;




import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import autoLoginUtil from '../../components/webView/helper';
import Header from './header';
import { useMMKVObject } from 'react-native-mmkv';
import { asyncStorageKeys } from '../../common/constants';
import { Button } from 'react-native-paper';

const AutoLoginWebView = () => {
  const webViewRef = useRef(null);
  const route = useRoute();
  const { screenName } = route.params || {};
  const navigation = useNavigation();
  const [userCredintials] = useMMKVObject(asyncStorageKeys.employeeCredintials);
  const [loginCredentials, setLoginCredentials] = useState(null);
  const [error, setError] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (userCredintials) {
      setLoginCredentials({
        loginId: userCredintials.loginId,
        password: userCredintials.password,
      });
    }
  }, [userCredintials]);

  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current.goBack();
    } else {
      Alert.alert(
        'Exit App',
        'Do you want to exit the app?',
        [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
    }
    return true;
  }, [canGoBack]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => handleBackPress();

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [handleBackPress])
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={() => setError(null)}>
          Retry
        </Button>
      </View>
    );
  }

  if (!loginCredentials) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const { loginId, password } = loginCredentials;

  const injectedJavaScript = autoLoginUtil(loginId, password);

  const onMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  const onShouldStartLoadWithRequest = (request) => {
    // Handle any custom URL schemes or conditions here
    return true;
  };

  const onReceivedSslError = (event) => {
    const { url, code, message } = event.nativeEvent;
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
      { cancelable: false }
    );
  };

  const dynamicUrl = `http://church.stealthems.in/Home/AppCall/?username=${loginId}&password=${password}`;
  console.log('fhjdfh',loginId, password);


  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <WebView
        ref={webViewRef}
        source={{ uri: screenName || dynamicUrl }}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onReceivedSslError={onReceivedSslError}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default AutoLoginWebView;





