import React from 'react';
import {Image, View} from 'react-native';
import useStyles from './useStyles';
import LinearGradient from 'react-native-linear-gradient';
import {useAppTheme} from '../../../../../theme';
import images from '../../../../../asset/images';

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={[
        theme.colors.primary,
        theme.colors.primaryContainer,
        theme.colors.primary,
      ]}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.container}>
      <Image source={images.appImages.login} style={styles.image} />
    </LinearGradient>
  );
};

export default Header;
