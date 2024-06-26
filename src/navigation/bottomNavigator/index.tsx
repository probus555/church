// import * as React from 'react';
// import {BottomNavigation, Text} from 'react-native-paper';
// import DrawerNavigator from '../drawer';
// // import Home from '../../screens/home';
// import AutoLoginWebView from '../../components/webView';
// // import Requests from '../../screens/requests/screens';
// // import ServicesScreen from '../../screens/services';
// import {
//   Modal,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import {Card, Title, Paragraph, Button} from 'react-native-paper';
// import ServicesModal from './components/services';
// import {useAppTheme} from '../../theme';
// // import PostTabs from '../../screens/community/posts/navigator';

// const BottomNavigator = () => {
//   const theme = useAppTheme();
//   const services = {
//     requests: {
//       description:
//         'This tab displays requests created by employees for approval or rejection by managers.',
//       items: [
//         {
//           id: 1,
//           name: 'Leave',
//           icon: 'calendar-outline',
//         },
//         {
//           id: 2,
//           name: 'Short Leave',
//           icon: 'timer-outline',
//         },
//         {
//           id: 3,
//           name: 'Punch Missing',
//           icon: 'time-outline',
//         },
//       ],
//     },
//   };

//   const [index, setIndex] = React.useState(0);
//   const [showServicesModal, setShowServicesModal] = React.useState(false);
//   const [routes] = React.useState([
//     {
//       key: 'home',
//       title: 'Home',
//       focusedIcon: 'home',
//       unfocusedIcon: 'home-outline',
//     },
//     {
//       key: 'services',
//       title: 'Notification',
//       focusedIcon: 'gamepad-circle',
//       unfocusedIcon: 'bell-outline',
//     },
//     {
//       key: 'community',
//       title: 'Profile',
//       focusedIcon: 'newspaper-variant-multiple',
//       unfocusedIcon: 'newspaper-variant-multiple-outline',
//     },
//   ]);

//   const renderScene = BottomNavigation.SceneMap({
//     AutoLoginWebView: AutoLoginWebView,
//     services: Home,
//     // community: PostTabs, // You can change this to another component if needed
//   });

//   const handleIndexChange = selectedIndex => {
//     if (selectedIndex === 1) {
//       // Show the Community modal
//       setShowServicesModal(true);
//     } else {
//       setIndex(selectedIndex);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <BottomNavigation
//         navigationState={{index, routes}}
//         onIndexChange={handleIndexChange}
//         barStyle={{
//           backgroundColor: theme.colors.background,
//           ...Platform.select({
//             ios: {
//               shadowColor: 'black',
//               shadowOpacity: 0.2,
//               shadowOffset: {width: 0, height: 2},
//               shadowRadius: 4,
//             },
//             android: {
//               elevation: 5,
//             },
//           }),
//         }}
//         activeIndicatorStyle={{backgroundColor: theme.colors.primaryContainer}}
//         renderScene={renderScene}
//         style={{backgroundColor: 'red'}}
//       />
//       {/* <ServicesModal
//         services={services}
//         visible={showServicesModal}
//         onClose={() => setShowServicesModal(false)}
//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   card: {
//     width: Dimensions.get('window').width,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     height: Dimensions.get('window').height / 1.4, // 1/3 of the screen height
//     position: 'absolute',
//     bottom: 0,
//   },
// });

// export default BottomNavigator;




import React from 'react';
import { View, StyleSheet } from 'react-native';
import Profile from '../../screens/profile';
import AutoLoginWebView from '../../components/webView';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import PostTabs from '../../screens/community/posts/navigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MyComponent() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={AutoLoginWebView}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account" size={size} color={color} />;
          },
        }}
      />

<Tab.Screen
        name="Community"
        component={PostTabs}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="newspaper-variant-multiple" size={size} color={color} />;
          },
        }}
      />


  



    </Tab.Navigator>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Settings!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




