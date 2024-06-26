import {employeeSlice} from './emloyeeSlice';
import pinSlice from './pinSlice';
import snackbarSlice from './snackbarSlice';

export default {
  employeeReducer: employeeSlice,
  snackBarReducer: pinSlice,
  pinReducer: snackbarSlice,
};
