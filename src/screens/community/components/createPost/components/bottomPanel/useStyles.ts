import {StyleSheet} from 'react-native';

export const useStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop:8,
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
  });
