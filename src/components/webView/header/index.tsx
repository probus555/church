import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NavigationActionType, screenNames } from '../../../navigation/rootNavigator/types';
import useStyles from './useStyles';
import useHeader from './useHeader';
import greetUser from './greeting';

const images = {
  sunny: require('../../../asset/images/webView/sunny.webp'),
  cloudy: require('../../../asset/images/webView/cloudy.jpg'),
  rainy: require('../../../asset/images/webView/rainy.jpg'),
  snowy: require('../../../asset/images/webView/cloudy.jpg'),
  defaultBackground: require('../../../asset/images/webView/cloudy.jpg'), // Fallback/default image
  appImages: {
    noProfile: require('../../../asset/images/webView/cloudy.jpg'),
  },
};

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  const { employeeDetails } = useHeader();
  const { message } = greetUser();
  const navigation = useNavigation<NavigationActionType>();

  const handleProfileImagePress = () => {
    navigation.navigate(screenNames.profile, { userId: null });
  };

  const [weather, setWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(images.defaultBackground); // Default background image

  const fetchWeather = async (location) => {
    const API_KEY = '3192dfcf1643de07950bd30f3f729e36'; // Replace with your actual API key
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    try {
      const response = await fetch(`${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getBackgroundImage = (weather) => {
    if (!weather || !weather.weather || weather.weather.length === 0) {
      return images.defaultBackground;
    }
    const weatherCondition = weather.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case 'clear':
        return images.sunny;
      case 'clouds':
        return images.cloudy;
      case 'rain':
        return images.rainy;
      case 'snow':
        return images.snowy;
      default:
        return images.defaultBackground;
    }
  };

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeather('Pune'); // Replace with the desired location
      setWeather(data);
      setBackgroundImage(getBackgroundImage(data));
    };

    getWeather();
  }, []);

  return (
    <ImageBackground
      blurRadius={2}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}
      source={backgroundImage}>
      <View style={styles.parentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.rowLeftContainer}>
            <View style={styles.userGreetContainer}>
              <Text style={styles.greetText}>{message}</Text>
              <Text style={styles.usernameText}>
                {employeeDetails?.employeeName ? employeeDetails?.employeeName : 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <Pressable onPress={handleProfileImagePress}>
              <FastImage
                resizeMode="cover"
                style={styles.profileImage}
                source={
                  employeeDetails?.photo
                    ? { uri: employeeDetails.photo }
                    : images.appImages.noProfile
                }
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.weatherContainer}>
          {weather ? (
            <View>
              <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
              <Text style={styles.weatherText}>{weather.weather[0].description}</Text>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;




// import React, { useEffect, useState } from 'react';
// import { ImageBackground, Pressable, View, Text } from 'react-native';
// import useStyles from './useStyles';
// import images from '../../../asset/images';
// import FastImage from 'react-native-fast-image';
// import useHeader from './useHeader';
// import greetUser from './greeting';
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import { NavigationActionType, screenNames } from '../../../navigation/rootNavigator/types';

// type Props = {};

// const Header = (props: Props) => {
//   const styles = useStyles();
//   const { employeeDetails } = useHeader();
//   const { message, image } = greetUser();
//   const navigation = useNavigation<NavigationActionType>();

//   const handleProfileImagePress = () => {
//     navigation.navigate(screenNames.profile, { userId: null });
//   };

//   const [weather, setWeather] = useState(null);

//   const fetchWeather = async (location) => {
//     const API_KEY = '3192dfcf1643de07950bd30f3f729e36'; // Replace with your actual API key
//     const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
//     try {
//       const response = await fetch(`${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const getWeather = async () => {
//       const data = await fetchWeather('Pune'); // Replace with the desired location
//       setWeather(data);
//     };

//     getWeather();
//   }, []);

//   return (
//     <ImageBackground
//       blurRadius={2}
//       style={styles.headerImageBackgroundView}
//       imageStyle={styles.headerImage}
//       source={image}>
//       <View style={styles.parentContainer}>
//         <View style={styles.headerContainer}>
//           <View style={styles.rowLeftContainer}>
//             <View style={styles.userGreetContainer}>
//               <Text style={styles.greetText}>{message}</Text>
//               <Text style={styles.usernameText}>
//                 {employeeDetails?.employeeName ? employeeDetails?.employeeName : 'User'}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.rowRightContainer}>
//             <Pressable onPress={handleProfileImagePress}>
//               <FastImage
//                 resizeMode="cover"
//                 style={styles.profileImage}
//                 source={
//                   employeeDetails?.photo
//                     ? { uri: employeeDetails.photo }
//                     : images.appImages.noProfile
//                 }
//               />
//             </Pressable>
//           </View>
//         </View>
//         <View style={styles.weatherContainer}>
//           {weather ? (
//             <View>
//               <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
//               <Text style={styles.weatherText}>{weather.weather[0].description}</Text>
//             </View>
//           ) : (
//             <Text style={styles.loadingText}>Loading...</Text>
//           )}
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// export default Header;
