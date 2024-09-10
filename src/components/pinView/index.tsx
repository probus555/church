import {PinCode, PinCodeT} from '@anhnch/react-native-pincode';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import usePinView from './usePinView';
import {useAppDispatch} from '../../redux/hooks/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setPinMode, setPinVisibility} from '../../redux/slices/pinSlice';

type Props = {};

const PinView = (props: Props) => {
  const {pin, pinMode, setPin, visible} = usePinView();
  const dispatch = useAppDispatch();
  return (
    <PinCode
      pin={pin}
      textOptions={{set:{cancel:''}}}
      mode={pinMode}
      options={{maxAttempt:3}}
      visible={visible}
      styles={{
        main: {...StyleSheet.absoluteFillObject, zIndex: 999999},
      }}
      options={{
        backSpace: <Icon name='backspace' size={24} color='white' />,
        retryLockDuration: 1000,
        maxAttempt: 3
      }}
      onSet={newPin => {
        setPin(newPin);
        dispatch(setPinVisibility(false));
      }}
      onSetCancel={() => dispatch(setPinVisibility(false))}
      onReset={() => {
        setPin(undefined);
        dispatch(setPinMode(PinCodeT.Modes.Set));
      }}
      onEnter={() => dispatch(setPinVisibility(false))}
    />
  );
};

export default PinView;
