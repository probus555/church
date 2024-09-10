import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../../../theme';
import Metrics from '../../../../theme/metrics/screen';

export const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    textInput: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
    },
    descriptionInput: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: '#FFF',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    iconButtonContainer: {
      flexDirection: 'row',
      marginLeft: 10,
    },
    postButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    postButtonText: {
      color: '#FFF',
      fontSize: 16,
    },
    selectedMediaContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    selectedMedia: {
      width: Metrics.screenWidth - 40,
      height: Metrics.screenWidth - 40,
      borderRadius: 5,
      marginRight: 10,
    },
    cancelButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
      position: 'absolute',
      right: '1%',
      zIndex: 999,
    },
    cancelButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    asset: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginTop: 10,
    },
  });
};
