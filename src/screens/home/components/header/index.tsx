import React from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import useStyles from './useStyles';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import FastImage from 'react-native-fast-image';

import {Searchbar} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import {DrawerActions, useNavigation} from '@react-navigation/native';
import {
  NavigationActionType,
  screenNames,
} from '../../../../navigation/rootNavigator/types';

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();

  const navigation = useNavigation<NavigationActionType>();
  const handleProfileImagePress = () => {};

  return (
    <ImageBackground
      blurRadius={2}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}>
      <View style={styles.parentContainer}>
        <View style={styles.userGreetContainer}>
          <Text style={{}}>Hiii Sarthak,</Text>
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.rowLeftContainer}>
            <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              size={22}
              color={'#ffffff'}
            />

            <View style={styles.userGreetContainer}>
              <Text style={styles.usernameText}>Good Morning</Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <Pressable onPress={handleProfileImagePress}>
              <FastImage resizeMode="cover" style={styles.profileImage} />
            </Pressable>
          </View>
        </View>
        <Searchbar
          value=""
          mode="view"
          placeholder="Search Employees"
          editable={false}
          style={styles.searchBar}
          inputStyle={styles.searchText}
        />
      </View>
    </ImageBackground>
  );
};

export default Header;
