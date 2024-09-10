import {StyleSheet} from 'react-native';
import Metrics from '../../../../../theme/metrics/screen';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      height: Metrics.screenHeight / 3,
      justifyContent: 'center',
      borderBottomRightRadius: 35,
      borderBottomLeftRadius: 35,
      flex: 1,
    },
    image: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      zIndex: 9999,
      borderBottomRightRadius: 35,
      borderBottomLeftRadius: 35,
    },
  });
};
export default useStyles;
