import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    dropdown: {
      height: 55,
      borderColor: theme.colors.outlineVariant,
      
      borderWidth: 1,
      // borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor:'#f1f1f1',
      // backgroundColor: theme.colors.background,
    },
    label: {
      position: 'absolute',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
      color:theme.colors.onBackground
    },
    placeholderStyle: {
      fontSize: 16,
      color:theme.colors.onBackground
    },
    selectedTextStyle: {
      fontSize: 16,
      color: theme.colors.onBackground,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });
};
export default useStyles;
