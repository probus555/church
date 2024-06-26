import {useMMKV, useMMKVString} from 'react-native-mmkv';
import {PinCode, PinCodeT} from '@anhnch/react-native-pincode';
import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks/hooks';
import {asyncStorageKeys} from '../../common/constants';
const usePinView = () => {
  const [pin, setPin] = useMMKVString(asyncStorageKeys.pin);
  const {pinMode, visible} = useAppSelector(state => state.pin);

  return {
    pin,
    pinMode,
    setPin,
    visible,
  };
};
export default usePinView;
