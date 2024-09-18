import React from 'react';
import {ImageBackground, Pressable, ScrollView, View,TouchableOpacity} from 'react-native';
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
import { useAppSelector } from '../../redux/hooks/hooks';
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
  const { employeeDetails } = useAppSelector(state => state.employee);
  const {userId}: {userId: string | number | undefined} = route.params ?? {};
  const {userDetails} = useProfile(userId);
  const navigation = useNavigation<NavigationActionType>();
  const theme = useAppTheme();
  console.log('userDetails?.photo', userDetails?.photo);
  console.log('employeeDetails1111',employeeDetails)
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
                name="cog-outline"
                size={22}
                color={'#ffffff'}
                onPress={() => navigation.navigate(screenNames.settingScreen)}
              />
            </View>
          </View>

          <View style={styles.profileContainer}>
            
            {/* <FastImage
              resizeMode="cover"
              style={styles.profileImage}
              source={
                userDetails?.photo
                  ? {uri: userDetails?.photo}
                  : images.appImages.noProfile
              }
            /> */}

<FastImage
  resizeMode="cover"
  style={styles.profileImage}
  source={
    userDetails?.photo
      ? { uri: userDetails?.photo.replace(/\\/g, '/') } // Replacing backslashes with forward slashes
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
                 {/* <TouchableOpacity
          style={{   backgroundColor: '#000000',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 20,
            marginHorizontal: 20,}}
          onPress={() => navigation.navigate(screenNames.editProfileScreen, { userId })}
        >
          <Text style={{  color: '#fff',
    fontSize: 16,}}>Edit Profile</Text>
        </TouchableOpacity> */}
   <TouchableOpacity
  style={{
    borderColor: '#ffffff',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row', // Added to align the icon and text in a row
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  }}
  onPress={() =>
    navigation.navigate(screenNames.editProfileScreen, {userId})
  }>
  {/* Pencil Icon */}

  
  {/* Edit Profile Text */}
  <Text
    style={{
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 18 
    }}>
    Edit Profile
  </Text>
  <Icon
    name="pencil"
    size={18} // Adjust the size of the pencil icon
    color="#ffffff" // Set the color of the pencil icon
    style={{ marginRight: 18 }} // Add spacing between icon and text
  />
</TouchableOpacity>

            {userDetails && (
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
          </View>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;



// import React from 'react';
// import {ScrollView, View, TouchableOpacity, Pressable} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Text from '../../components/Text';
// import FastImage from 'react-native-fast-image';
// import LinearGradient from 'react-native-linear-gradient';
// import {useAppTheme} from '../../theme';
// import {DrawerActions, useNavigation} from '@react-navigation/native';
// import useProfile from './useProfile';
// import images from '../../asset/images';
// import {
//   handlePressContactDetails,
//   getBase64Uri,
// } from '../../common/utils/helper';
// import {
//   NavigationActionType,
//   RootStackParamList,
//   screenNames,
// } from '../../navigation/rootNavigator/types';
// import {StackNavigationProp} from '@react-navigation/stack';

// type ProfileScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'profile'
// >;

// type Props = {
//   navigation: ProfileScreenNavigationProp;
//   route: {
//     params: {
//       userId: string;
//     };
//   };
// };

// const Profile: React.FC<Props> = ({route}) => {
//   const {userId}: {userId: string | number | undefined} = route.params ?? {};
//   const {userDetails} = useProfile(userId);
//   const navigation = useNavigation<NavigationActionType>();
//   const theme = useAppTheme();

//   return (
//     <ScrollView>
//       <View style={{flex: 1, backgroundColor: theme.colors.background}}>
//         <LinearGradient
//           colors={[theme.colors.primary, theme.colors.primary]}
//           style={{paddingBottom: 20, paddingHorizontal: 15, paddingTop: 50}}>
          
//           {/* Header */}
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <Icon
//               name="chevron-left"
//               size={22}
//               onPress={() => navigation.goBack()}
//               color={theme.colors.background}
//             />
//             <Icon
//               name="cog-outline"
//               size={22}
//               color="#fff"
//               onPress={() => navigation.navigate(screenNames.settingScreen)}
//             />
//           </View>

//           {/* Profile Image and Info */}
//           <View style={{alignItems: 'center', marginTop: 20}}>
//             <FastImage
//               resizeMode="cover"
//               style={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: 50,
//                 marginBottom: 10,
//               }}
//               source={
//                 userDetails?.photo
//                   ? {uri: userDetails?.photo}
//                   : images.appImages.noProfile
//               }
//             />
//             <Text style={{fontSize: 20, fontWeight: '600', color: '#fff'}}>
//               {userDetails?.employeeName}
//             </Text>
//             <Text style={{fontSize: 16, color: '#fff', marginVertical: 5}}>
//               {userDetails?.grade}
//             </Text>
//             <Text style={{fontSize: 16, color: '#fff'}}>
//               {`${userDetails?.churchName} | ${userDetails?.address}`}
//             </Text>
//           </View>

//           {/* Edit Profile Button */}
//           <TouchableOpacity
//             style={{
//               borderColor: '#1877F2',
//               borderWidth: 1,
//               paddingVertical: 10,
//               paddingHorizontal: 20,
//               borderRadius: 30,
//               alignItems: 'center',
//               marginTop: 20,
//               width: '60%',
//               alignSelf: 'center',
//               backgroundColor: 'transparent',
//             }}
//             onPress={() =>
//               navigation.navigate(screenNames.editProfileScreen, {userId})
//             }>
//             <Text
//               style={{
//                 color: '#1877F2',
//                 fontSize: 16,
//                 fontWeight: '600',
//               }}>
//               Edit Profile
//             </Text>
//           </TouchableOpacity>
//         </LinearGradient>

//         {/* Contact Details */}
//         {userId && (
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               marginVertical: 20,
//             }}>
//             <Pressable
//               onPress={() =>
//                 handlePressContactDetails('phone', userDetails?.mobileNo)
//               }>
//               <Icon name="phone" size={30} color={theme.colors.tertiary} />
//             </Pressable>
//             <Pressable
//               onPress={() =>
//                 handlePressContactDetails('message', userDetails?.mobileNo)
//               }>
//               <Icon
//                 name="message-text"
//                 size={30}
//                 color={theme.colors.tertiary}
//               />
//             </Pressable>
//             <Pressable
//               onPress={() =>
//                 handlePressContactDetails('email', userDetails?.emailID)
//               }>
//               <Icon name="email" size={30} color={theme.colors.tertiary} />
//             </Pressable>
//           </View>
//         )}

//         {/* User Additional Info */}
//         {userDetails && (
//           <View style={{paddingHorizontal: 20}}>
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <Icon
//                 name="calendar-month"
//                 size={25}
//                 color={theme.colors.tertiary}
//               />
//               <Text style={{marginLeft: 10, fontSize: 16, color: '#333'}}>
//                 {userDetails?.joiningDate}
//               </Text>
//             </View>

//             <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
//               <Icon name="cake" size={25} color={theme.colors.tertiary} />
//               <Text style={{marginLeft: 10, fontSize: 16, color: '#333'}}>
//                 {userDetails?.birthDate}
//               </Text>
//             </View>

//             {userDetails?.emailID && (
//               <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
//                 <Icon name="email" size={25} color={theme.colors.tertiary} />
//                 <Text style={{marginLeft: 10, fontSize: 16, color: '#333'}}>
//                   {userDetails?.emailID}
//                 </Text>
//               </View>
//             )}

//             {userDetails?.mobileNo && (
//               <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
//                 <Icon name="phone" size={25} color={theme.colors.tertiary} />
//                 <Text style={{marginLeft: 10, fontSize: 16, color: '#333'}}>
//                   {userDetails?.mobileNo}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default Profile;






