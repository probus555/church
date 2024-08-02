import {StyleSheet} from 'react-native';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    image: {
      height: 225,
      width: 225,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
};
export default useStyles;
