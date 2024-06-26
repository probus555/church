import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Switch} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/Text';
import useStyle from './useStyles';
import {MMKV, useMMKV, useMMKVBoolean, useMMKVString} from 'react-native-mmkv';
import {useAppTheme} from '../../theme';
import {useAppDispatch} from '../../redux/hooks/hooks';
import {setPinMode} from '../../redux/slices/pinSlice';
import {PinCodeT} from '@anhnch/react-native-pincode';
import {asyncStorageKeys} from '../../common/constants';
import {storage} from '../../services/mmkvStorgae';

type Props = {};

const SettingScreen = (props: Props) => {
  const theme = useAppTheme();
  const [pin, setPin] = useMMKVString(asyncStorageKeys.pin);

  const styles = useStyle();
  const [isAppLockEnabled, setIsAppLockEnabled] = useMMKVBoolean(
    'isAppLockEnabled',
    storage,
  );
  const dispatch = useAppDispatch();

  //   dispatch(setPinMode(PinCodeT.Modes.Set));
  const handleAppLockToggle = value => {
    console.log('value', value);
    if (value) {
      dispatch(setPinMode(PinCodeT.Modes.Set));
    } else {
      setPin('');
    }
    setIsAppLockEnabled(value);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.privacyContainer}>
          <Icon name="lock" size={25} color={theme.colors.shadow} />
          <Text style={styles.userNameText}>Privacy</Text>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>App Lock</Text>
          <Switch
            value={isAppLockEnabled}
            onValueChange={handleAppLockToggle}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.descriptionText}>
          {isAppLockEnabled
            ? 'App Lock is enabled. Your app will require a password or biometric authentication to open.'
            : 'App Lock is disabled. Your app will open without any authentication.'}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
