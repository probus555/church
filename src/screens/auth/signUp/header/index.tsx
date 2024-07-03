import React from 'react';
import useStyles from './useStyles';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import {useAppTheme} from '../../../../theme';
import {useNavigation} from '@react-navigation/native';

import { screenNames } from '../../../../navigation/rootNavigator/types';

const Header: React.FC = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-left-bold"
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate(screenNames.login)}
        size={32}
      />
      <Text style={styles.headerText}>Registration</Text>
    </View>
  );
};

export default Header;















