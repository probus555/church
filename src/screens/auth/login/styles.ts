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
      marginTop: '10%',
      color: theme.colors.onBackground,
      fontWeight: '900',
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
    },
    card: {
      backgroundColor: theme.colors.background,
      width: '85%',
      alignSelf: 'center',
      borderRadius: 26,
      padding: 20,
      top: -Metrics.screenHeight / 16,
      borderWidth: 1,
      borderColor: 'grey',
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
      backgroundColor: theme.colors.background,
      color: theme.colors.onBackground,
    },
  });

  return styles;
};

export default useStyles;
