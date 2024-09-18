import React, { useEffect, useState, useCallback } from 'react';
import {
  ImageBackground,
  Pressable,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import { NavigationActionType, screenNames } from '../../../navigation/rootNavigator/types';
import useStyles from './useStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import useHeader from './useHeader';
import { useMMKV } from 'react-native-mmkv';
import { CommonActions } from '@react-navigation/native';
import greetUser from './greeting';
import { useAppTheme } from '../../../theme';
import axios from 'axios';

const images = {
  sunny: require('../../../asset/images/webView/sunny.webp'),
  cloudy: require('../../../asset/images/webView/cloudy.jpg'),
  rainy: require('../../../asset/images/webView/rainy.jpg'),
  scatterd: require('../../../asset/images/webView/scattered-cloud.jpg'),
  snowy: require('../../../asset/images/webView/cloudy.jpg'),
  defaultBackground: require('../../../asset/images/webView/cloudy.jpg'),
  appImages: {
    noProfile: require('../../../asset/images/webView/cloudy.jpg'),
  },
};

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { employeeDetails } = useHeader();
  const { message } = greetUser();
  const navigation = useNavigation<NavigationActionType>();
  const storage = useMMKV();

  console.log('employeeDetailsHeader', employeeDetails); // Log employee details

  const handleLogout = async () => {
    console.log('Starting logout process...');

    try {
      console.log('Clearing storage...');
      await storage.clearAll();
      console.log('Storage cleared');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: screenNames.login }],
        }),
      );
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleProfileImagePress = () => {
    navigation.navigate(screenNames.profile, { userId: null });
  };

  const [weather, setWeather] = useState<any>(null);
  const [backgroundImage, setBackgroundImage] = useState(images.defaultBackground);
  const [notificationCount, setNotificationCount] = useState(0);

  console.log('NotificationCount:', notificationCount); // Log notification count

  const fetchWeather = async (location: string) => {
    const API_KEY = '3192dfcf1643de07950bd30f3f729e36';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    try {
      const response = await fetch(
        `${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather:', error); // Log weather fetch error
    }
  };

  const getBackgroundImage = (weather: any) => {
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

  const fetchNotificationCount = async () => {
    const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';
    const employee = employeeDetails?.id;

    if (!employee) {
      console.error('EmployeeId is missing.');
      return;
    }

    let API_URL = '';
    if (employeeDetails?.role === 'Leader') {
      API_URL = 'http://49.248.250.54:8081/api/Count';
    } else if (employeeDetails?.role === 'Individual') {
      API_URL = 'http://49.248.250.54:8081/api/CountNotification';
    }

    console.log('API_URL:', API_URL); // Log the API URL being used

    if (!API_URL) {
      console.error('Role not recognized or API URL is missing.');
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      console.log('API response:', response.data); // Log API response
      if (response.data && typeof response.data.count === 'number') {
        setNotificationCount(response.data.count);
      } else {
        console.error('Unexpected API response format:', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error fetching notification count:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotificationCount();
    }, [])
  );

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchWeather('pune'); // Replace with the desired location
      setWeather(data);
      setBackgroundImage(getBackgroundImage(data));
    };

    getWeather();
    fetchNotificationCount(); // Fetch notification count on component mount
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
                {employeeDetails?.employeeName
                  ? employeeDetails?.employeeName
                  : 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}>
              <Icon name="sign-out" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.weatherContainer}>
            {weather ? (
              <View>
                <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
                <Text style={styles.weatherText}>
                  {weather.weather[0].description}
                </Text>
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading...</Text>
            )}
          </View>

          <View style={styles.bellIconContainer}>
            <Icon
              name="bell"
              size={22}
              color={'#ffffff'}
              onPress={() =>
                navigation.navigate(screenNames.notificationScreen)
              }
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;









