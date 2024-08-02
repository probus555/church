import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../../theme';
import Metrics from '../../../theme/metrics/screen';
import fontStyles from '../../../theme/fonts/fontStyles';

const useStyles = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    loginText: {
      textAlign: 'center',
      marginTop: '20%',
      fontSize: 25,
      color: theme.colors.onBackground,
      // fontWeight: '900',
      fontFamily: 'Montserrat-Bold',
    },
    hrText: {fontWeight: '600', color: theme.colors.onBackground},
    inputContainer: {
      marginTop: 40,
      gap: 20,
      backgroundColor: theme.colors.background,
    },
    errorText: {
      color: theme.colors.error,
    },
    inputFieldsContainer: {
      gap: 5,
      backgroundColor: theme.colors.background,
      // borderWidth: 0.5,
    },
    card: {
      backgroundColor: theme.colors.background,
      width: '100%',
      alignSelf: 'center',
      // borderRadius: 26,
      padding: 20,
      top: -Metrics.screenHeight / 16,
      // marginTop: 125,
      paddingBottom: 60,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 1,
      elevation: 4,
    },
    forgotPasswordText: {
      alignSelf: 'center',
      color: theme.colors.onBackground,
    },

    inputText: {
      textTransform: 'uppercase',
      // backgroundColor: theme.colors.background,
      backgroundColor: '#f1f1f1',
      color: theme.colors.onBackground,
      borderWidth: 0.2,
      borderColor: 'grey',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomWidth: 0,
    },
    inputWrapper: {
      alignItems: 'flex-start',
      gap: 10,
    },

    inputLabel: {
      fontSize: fontStyles.size.font14,
      fontFamily: 'Montserrat-Bold',

      // fontWeight: fontStyles.weight.medium,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',

      // borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
    },
    dateInput: {
      height: 60,
      borderColor: 'gray',
      borderWidth: 0.5,
      // marginBottom: 20,
      justifyContent: 'center',
      paddingLeft: 10,
      backgroundColor: '#f1f1f1',
    },
    dateText: {
      fontSize: 16,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: 'white',
      margin: 20,
      padding: 20,
      borderRadius: 10,
    },
    fileUploadContainer: {alignSelf: 'center', alignItems: 'center', gap: 10},
    fileUploadBtn: {},
    selectedFileContainer: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    selectedFileContainer: {
      alignItems: 'center',
      alignSelf: 'center',
    },
  });

  return styles;
};

export default useStyles;
