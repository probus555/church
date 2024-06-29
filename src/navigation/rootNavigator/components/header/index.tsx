import React from 'react';
import useStyles from './useStyles';
import {View} from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import {useAppTheme} from '../../../../theme';
import {StackHeaderProps, StackNavigationOptions} from '@react-navigation/stack';
import {getHeaderTitle} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import {NavigationActionType, screenNames} from '../../types';
// import {useGetNotificationCountQuery} from '../../../../redux/services/notifications';
import {Badge} from 'react-native-paper';

const Header: React.FC<StackHeaderProps> = ({navigation, route, options, back}) => {
  const styles = useStyles();
  const theme = useAppTheme();
  const title = getHeaderTitle(options, route.name);
  // const {data: ntfCount} = useGetNotificationCountQuery(null);
  return (
    <View style={styles.container}>
      {back && (
        <Icon
          name="chevron-left"
          color={theme.colors.onPrimary}
          
  
          onPress={() => navigation.goBack()}
          size={32}
        />
      )}


      
      <Text style={styles.headerText}>{title}</Text>
      {/* {route.name !== screenNames.notificationScreen && (
        <View style={styles.notificationContainer}>
          <Icon
            name="bell"
            onPress={() => navigation.navigate(screenNames.notificationScreen)}
            color={theme.colors.onPrimary}
            size={32}
          />
          {ntfCount > 0 && (
            <Badge style={styles.badge}>{ntfCount}</Badge>
          )}
        </View>
      )} */}
    </View>
  );
};

export default Header;






















