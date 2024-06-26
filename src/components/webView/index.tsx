import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import autoLoginUtil from '../../components/webView/helper';
import Header from './components/header';

const AutoLoginWebView = () => {
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();

  // Extract loginId and password from route params
  const { loginId, password } = route.params || {};

  // Generate the injected JavaScript with the provided username and password
  const injectedJavaScript = autoLoginUtil(loginId, password);

  const onMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  const onShouldStartLoadWithRequest = (request) => {
    // Handle any custom URL schemes or conditions here
    return true;
  };

  const onReceivedSslError = (event) => {
    // This function will handle SSL certificate errors
    const { url, code, message } = event.nativeEvent;
    Alert.alert(
      "SSL Certificate Error",
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

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <WebView
        ref={webViewRef}
        source={{ uri: 'http://church.stealthems.in/Individuals/Individuals/Dashboard' }} // Replace with your actual URL
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
