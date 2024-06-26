import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme';
import fontStyles from '../../theme/fonts/fontStyles';

const useStyle = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    userNameText: {
      color: '#191970',
      fontSize: fontStyles.size.font18,
      fontWeight: '700',
      textAlign: 'center',
    },
    privacyContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      gap: 20,
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: 'lightGrey',
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 16,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: '#f1f1f1',
      borderRadius: 8,
    },
    toggleLabel: {
      fontSize: fontStyles.size.font16,
      fontWeight: '700',
    },
    descriptionText: {
      color: '#000000',
      fontSize: fontStyles.size.font14,
      fontWeight: '700',
      paddingHorizontal: 18,
    },
  });
};
export default useStyle;
