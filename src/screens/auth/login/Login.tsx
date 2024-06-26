import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Alert,
} from 'react-native';
import {useAppTheme} from '../../../theme';
import useStyles from './styles';
import {Button, Divider, TextInput} from 'react-native-paper';
import {Text} from '../../../components/Text/Text';
import PasswordInput from '../../../components/passwordInput/PasswordInput';
import Header from './components/header/Header';
import useLogin from './useLogin';
import {screenNames} from '../../../navigation/rootNavigator/types';
import LoadingIndicator from '../../../components/loadingIndicator/LoadingIndicator';

const Login: React.FC = ({navigation}) => {
  const styles = useStyles();
  const theme = useAppTheme();

  const {
    customerData: {loginId, password},
    errors,
    updateCustomerData,
    handleLogin,
    loginResult,
  } = useLogin();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <LoadingIndicator loading={loginResult.isLoading} text="signing in" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Header />
          <View style={styles.card}>
            <Text variant="displaySmall" style={styles.loginText}>
              Login
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputFieldsContainer}>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Login ID"
                  outlineColor={theme.colors.outline}
                  value={loginId}
                  onChangeText={text => updateCustomerData({loginId: text})}
                />
                {errors.loginId ? (
                  <Text style={styles.errorText}>{errors.loginId}</Text>
                ) : null}
              </View>
              <View style={styles.inputFieldsContainer}>
                <PasswordInput
                  mode="flat"
                  value={password}
                  style={styles.inputText}
                  onChangeText={text => updateCustomerData({password: text})}
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>
              <Button mode="contained" onPress={handleLogin}>
                Login
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.replace(screenNames.signup)}>
                New Registration
              </Button>
              <Divider />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
