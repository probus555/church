import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: theme.colors.surface,
    },
    homeContainer: {
      flex: 1,
      // borderTopLeftRadius:20,
      // borderTopRightRadius:20,
      // top:"-3%",
      padding: 10,
      gap: 20,
    },
  });
};
export default useStyles;
