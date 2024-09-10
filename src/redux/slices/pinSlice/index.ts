import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {PinState} from './types';
import {PinCodeT} from '@anhnch/react-native-pincode';

const initialState: PinState = {
  visible: false,
  pinMode: PinCodeT.Modes.Set,
};

export const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    setPinVisibility: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setPinMode: (state, action: PayloadAction<PinCodeT.Modes>) => {
      state.pinMode = action.payload;
      state.visible = true;
    },
  },
});

export const {setPinMode, setPinVisibility} = pinSlice.actions;

export default pinSlice.reducer;
