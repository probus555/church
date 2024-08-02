import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    homeContainer: {
      flex: 1,
      padding: 10,
      gap: 20,
    },
  });
};
export default useStyles;
