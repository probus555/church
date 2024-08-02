import React from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import useStyles from './useStyles';
// import images from '../../../../assets/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import FastImage from 'react-native-fast-image';
// import useHeader from './useHeader';
import {Searchbar} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
// import greetUser from './greeting';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {
  NavigationActionType,
  screenNames,
} from '../../../../navigation/rootNavigator/types';

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  // const {employeeDetails,ntfCount} = useHeader();
  // const {message, image} = greetUser();
  const navigation = useNavigation<NavigationActionType>();
  const handleProfileImagePress = () => {
    // Navigate to the user profile screen, you can pass parameters if needed
    // navigation.navigate(screenNames.profile, {userId: null});
  };

  return (
    <ImageBackground
      blurRadius={2}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}
    >
      <View style={styles.parentContainer}>

      <View style={styles.userGreetContainer}>
              {/* <Text style={styles.greetText}>{message}</Text> */}
              <Text style={{}}>
                Hiii  Sarthak,
              </Text>
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
              {/* <Text style={styles.greetText}>{message}</Text> */}
              <Text style={styles.usernameText}>
                  Good Morning
              </Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
         


            <Pressable onPress={handleProfileImagePress}>
              <FastImage
                resizeMode="cover"
                style={styles.profileImage}
                // source={
                //   employeeDetails?.photo
                //     ? {uri: employeeDetails.photo}
                //     : images.appImages.noProfile
                // }
              />
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
