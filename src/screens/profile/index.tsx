import React from 'react';
import {ImageBackground, Pressable, ScrollView, View} from 'react-native';
import useStyles from './styles';
import images from '../../asset/images';
import useProfile from './useProfile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/Text';
import FastImage from 'react-native-fast-image';
import {
  NavigationActionType,
  RootStackParamList,
  screenNames,
} from '../../navigation/rootNavigator/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useAppTheme} from '../../theme';
import {
  getBase64Uri,
  handlePressContactDetails,
} from '../../common/utils/helper';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'profile'
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
  route: {
    params: {
      userId: string;
    };
  };
};
const Profile: React.FC<Props> = ({route}) => {
  const styles = useStyles();
  const {userId}: {userId: string | number | undefined} = route.params ?? {};
  const {userDetails} = useProfile(userId);
  const navigation = useNavigation<NavigationActionType>();
  const theme = useAppTheme();
console.log('userDetails?.photo',userDetails?.photo)
  return (
    <ScrollView>
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary]}
          style={styles.profileBackgroundContainer}>
          <View style={styles.headerContainer}>
            <Icon
              name="chevron-left"
              size={22}
              onPress={() => navigation.goBack()}
              color={theme.colors.background}
            />
            <View style={styles.iconContainer}>
              <Icon
                name="bell"
                size={22}
                color={theme.colors.background}
                style={{marginRight: 5}}
              />
              {!userId && (
                <Icon
                  name="cog-outline"
                  size={22}
                  color={'#ffffff'}
                  onPress={() => navigation.navigate(screenNames.settingScreen)}
                />
              )}
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FastImage
              resizeMode="cover"
              style={styles.profileImage}
              source={
                userDetails?.photo
                  ? {uri: userDetails?.photo}
                  : images.appImages.noProfile
              }
            />
            {userDetails ? (
              <View style={styles.profileTextContainer}>
                <Text style={styles.userNameText}>
                  {userDetails?.employeeName}
                </Text>
                <Text style={styles.userRoleText}>{userDetails?.grade}</Text>
                <Text
                  style={
                    styles.userRoleText
                  }>{`${userDetails?.churchName} | ${userDetails?.address} `}</Text>
              </View>
            ) : (
              <></>
            )}
            {userId && (
              <View style={styles.profileIconsContainer}>
                <Pressable
                  onPress={() =>
                    handlePressContactDetails('phone', userDetails?.mobileNo)
                  }
                  style={styles.profileIconWrappper}>
                  <Icon
                    name="phone"
                    size={30}
                    color={theme.colors.onPrimaryContainer}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    handlePressContactDetails('message', userDetails?.mobileNo)
                  }
                  style={styles.profileIconWrappper}>
                  <Icon
                    name="message-text"
                    size={30}
                    color={theme.colors.onPrimaryContainer}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    handlePressContactDetails('email', userDetails?.emailID)
                  }
                  style={styles.profileIconWrappper}>
                  <Icon
                    name="email"
                    size={30}
                    color={theme.colors.onPrimaryContainer}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </LinearGradient>
        {userDetails ? (
          <View style={styles.userDetailContainer}>
            <View style={styles.userDetailsWrapper}>
              <Icon
                name="card-account-details"
                size={25}
                color={theme.colors.tertiary}
              />
              <Text style={styles.userDetailText}>{userDetails?.id}</Text>
            </View>

            <View style={styles.userDetailsWrapper}>
              <Icon
                name="calendar-month"
                size={25}
                color={theme.colors.tertiary}
              />
              <Text style={styles.userDetailText}>
                {userDetails?.joiningDate}
              </Text>
            </View>
            <View style={styles.userDetailsWrapper}>
              <Icon name="cake" size={25} color={theme.colors.tertiary} />
              <Text style={styles.userDetailText}>
                {userDetails?.birthDate}
              </Text>
            </View>
            {userDetails?.emailID && (
              <View style={styles.userDetailsWrapper}>
                <Icon name="email" size={25} color={theme.colors.tertiary} />
                <Text style={styles.userDetailText}>
                  {userDetails?.emailID}
                </Text>
              </View>
            )}
            {userDetails?.mobileNo && (
              <View style={styles.userDetailsWrapper}>
                <Icon name="phone" size={25} color={theme.colors.tertiary} />
                <Text style={styles.userDetailText}>
                  {userDetails?.mobileNo}
                </Text>
              </View>
            )}
            {/* <View style={styles.userDetailsWrapper}>
              <Icon
                name={
                  userDetails?.gender?.toUpperCase() === 'MALE'
                    ? 'gender-male'
                    : 'gender-female'
                }
                size={25}
                color={theme.colors.tertiary}
              />
              <Text style={styles.userDetailText}>{userDetails?.gender}</Text>
            </View> */}
            {/* {userDetails?.bloodGroup && (
              <View style={styles.userDetailsWrapper}>
                <Icon name="water" size={25} color={theme.colors.tertiary} />
                <Text style={styles.userDetailText}>
                  {userDetails?.bloodGroup}
                </Text>
              </View>
            )} */}
            <View style={styles.userDetailsWrapper}>
              {/* <Icon
                name="calendar-clock"
                size={25}
                color={theme.colors.tertiary}
              /> */}
              <Text style={styles.userDetailText}>
                {userDetails?.memberSince}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
