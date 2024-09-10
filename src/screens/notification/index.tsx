import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { screenNames } from '../../navigation/rootNavigator/types';
import { useAppSelector } from '../../redux/hooks/hooks';

type UserRole = 'Leader' | 'Individual';

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('Individual');
  const navigation = useNavigation();
 const {employeeDetails}=useAppSelector((state)=>state.employee);
 console.log('employeedetails',employeeDetails)
  const fetchNotifications = async () => {
    let API_URL = '';
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';

    if (employeeDetails?.role === 'Leader') {
      API_URL = 'http://49.248.250.54:8081/api/AllNotifications';
    } else if (employeeDetails?.role === 'Individual') {
      API_URL = 'http://49.248.250.54:8081/api/AllNotification';
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      console.log('API Response:', response.data);

      if (response.data.status === 200) {
        const sortedNotifications = response.data.data.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setNotifications(sortedNotifications);
      } else {
        console.error('Failed to fetch notifications:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationStatus = async (notificationId: string, screenName: string) => {
    let API_URL = '';
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';

    if (role === 'Leader') {
      API_URL = 'http://49.248.250.54:8081/api/Status';
    } else if (role === 'Individual') {
      API_URL = 'http://49.248.250.54:8081/api/NotificationStatus';
    }

    try {
      console.log('nID',notificationId,"API_URL",API_URL,BEARER_TOKEN)
      const response = await axios.post(API_URL, {
        notificationId,
        read: true
      }, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      console.log('Response from status update API:', response.data);

      if (response.data.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.notificationId === notificationId ? { ...notification, read: true } : notification
          )
        );
        navigation.navigate(screenNames.myWebView, {
          screen: 'Home',
          params: { screenName: screenName }
        });
      } else {
        console.error('Failed to update notification status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const removeNotification = async (notificationId: string) => {
    const API_URL = 'http://49.248.250.54:8081/api/RemoveNotification';
    const SECONDARY_API_URL = 'http://49.248.250.54:8081/api/RemoveNotificationNotice';
    const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE2OTkzNzMsImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.BGZr5r5swcj8KT6dhc15mt14IWqUsKWNPdgfoWLqyVc';

    try {
      const response = await axios.post(API_URL, {
        notificationId
      }, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      console.log('Response from remove API:', response.data);

      if (response.data.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.notificationId !== notificationId)
        );

        // Call secondary API
        const secondaryResponse = await axios.post(SECONDARY_API_URL, {
          notificationId
        }, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });
        console.log('Response from secondary remove API:', secondaryResponse.data);
      } else {
        console.error('Failed to remove notification:', response.data.message);
      }
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  useEffect(() => {
    if(employeeDetails?.role){
      setRole(employeeDetails.role);
    }
    fetchNotifications();
  }, [employeeDetails]);

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: item.read ? '#fff' : '#d3d3d3' }]}>
      <TouchableOpacity 
        onPress={() => updateNotificationStatus(item.notificationId, item.screenName)} 
        style={styles.notificationContent}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.body}</Text>
        <Text style={styles.date}>{moment.unix(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        onPress={() => removeNotification(item.notificationId)} 
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={24} color="black" />
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.notificationId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  date: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
