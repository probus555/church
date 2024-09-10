import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import CameraCapture from '../../../../components/attendance/component/CameraCapture';
import useNearestLocation from '../../../../common/constants/helper/location';
import DeviceInfo from 'react-native-device-info';
import {useAppSelector} from '../../../../redux/hooks/hooks';
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetLatestInOutQuery,
} from '../../../../redux/services/attendance/attendanceApiSlice';
import HistoryContainer from '../../../../components/attendance/history';
const CheckInOutScreen = () => {
  const {data: checkInOutData} = useGetLatestInOutQuery();
  const {
    nearestLocation,
    distanceFromNearest,
    inRange,
    currentLatitude,
    currentLongitude,
  } = useNearestLocation();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const {employeeDetails} = useAppSelector(state => state.employee);
  const [userSelfie, setUserSelfie] = useState();
  const [openCamera, setOpenCamera] = useState(false);
  const navigation = useNavigation();
  const [checkedIn, setCheckedIn] = useState(false);
  const animatedValue = useSharedValue(1);
  useEffect(() => {
    if (checkInOutData) {
      setCheckedIn(
        checkInOutData?.status == null ||
          checkInOutData?.status?.toLowerCase() === 'inout'
          ? false
          : true,
      );
    }
  }, [checkInOutData?.status]);
  const [history, setHistory] = useState([
    {
      date: '2024-06-29',
      entries: [
        {time: '10:00 AM', type: 'in'},
        {time: '02:30 PM', type: 'out'},
      ],
    },
    {
      date: '2024-06-28',
      entries: [{time: '09:45 AM', type: 'in'}],
    },
    {
      date: '2024-06-27',
      entries: [{time: '11:15 AM', type: 'in'}],
    },
    {
      date: '2024-06-26',
      entries: [{time: '05:00 PM', type: 'out'}],
    },
  ]); // Dummy history data
  const [loading, setLoading] = useState(false);
  const generateCheckinPayload = async () => {
    const mid = DeviceInfo.getDeviceId();
    const mip = await DeviceInfo.getIpAddress();
    const now = new Date();
    const inDate = now.toISOString().split('T')[0];
    const inTime =
      now.toTimeString().split(' ')[0] +
      '.' +
      now.getMilliseconds().toString().padStart(3, '0');
    return {
      mid,
      mip,
      inDate,
      inTime,
      inLat: currentLatitude,
      inLong: currentLongitude,
      selfie: null,
      status: 'in',
      aCCSITES_Fid: nearestLocation?.siteid,
      employeeNo: employeeDetails?.id,
    };
  };
  const generateCheckoutPayload = async () => {
    const mid = DeviceInfo.getDeviceId();
    const mip = await DeviceInfo.getIpAddress();
    const now = new Date();
    const outDate = now.toISOString().split('T')[0];
    const outTime =
      now.toTimeString().split(' ')[0] +
      '.' +
      now.getMilliseconds().toString().padStart(3, '0');
    return {
      mid,
      mip,
      outDate,
      outTime,
      outLat: currentLatitude,
      outLong: currentLongitude,
      selfie: null,
      status: 'inout',
      aCCSITES_Fid: nearestLocation?.siteid,
      employeeNo: employeeDetails?.id,
    };
  };
  const handleCheckInOutPress = () => {
    if (!inRange) {
      Alert.alert(
        'Not in Range',
        `You are ${distanceFromNearest}m away from ${nearestLocation?.locationName}. Attendance marking is disabled.`,
      );
      return;
    }
    setOpenCamera(true);
    const action = checkedIn ? 'checked out' : 'checked in';
    const currentDate = new Date().toLocaleDateString();
    const currentEntry = {time: new Date().toLocaleString(), type: action};
    setHistory(prevHistory => {
      const lastItem = prevHistory[0];
      if (lastItem && lastItem.date === currentDate) {
        lastItem.entries = [currentEntry, ...lastItem.entries];
        return [lastItem, ...prevHistory.slice(1)];
      } else {
        return [{date: currentDate, entries: [currentEntry]}, ...prevHistory];
      }
    });
    setCheckedIn(!checkedIn);
    setOpenCamera(true);
  };
  const handlePressIn = () => {
    animatedValue.value = withTiming(0.95, {duration: 100});
  };
  const handlePressOut = () => {
    animatedValue.value = withTiming(1, {duration: 100});
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: animatedValue.value}],
  }));
  const calculateWorkDuration = entries => {
    if (!entries || entries.length === 0) return 'N/A';
    const checkInTime = entries.find(entry => entry.type === 'in');
    const checkOutTime = entries.find(entry => entry.type === 'out');
    if (!checkInTime || !checkOutTime) return 'N/A';
    const checkIn = new Date(checkInTime.time);
    const checkOut = new Date(checkOutTime.time);
    const diffMs = checkOut - checkIn;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };
  const getCheckinOutStatus = () => {
    return checkInOutData?.status == null ||
      checkInOutData?.status?.toLowerCase() === 'inout'
      ? 'Check In'
      : 'Check Out';
  };
  const markAttendance = async selfie => {
    setOpenCamera(false);
    setLoading(true);
    const payload =
      checkInOutData?.status == null ||
      checkInOutData?.status?.toLowerCase() === 'inout'
        ? await generateCheckinPayload()
        : await generateCheckoutPayload();
    const timestamp = new Date().getTime();
    const selfieName = `selfie_${timestamp}_${
      payload.status === 'in' ? 'checkin' : 'checkout'
    }.jpg`;
    payload.selfie = {
      uri: `file://${selfie.path}`,
      type: 'image/jpeg',
      name: selfieName,
    };
    try {
      if (payload.status === 'in') {
        await checkIn(payload);
        setUserSelfie(selfie);
        setLoading(false);
        Alert.alert('Checked In', 'You have successfully checked in.');
      } else {
        await checkOut(payload);
        setUserSelfie(selfie);
        setLoading(false);
        Alert.alert('Checked Out', 'You have successfully checked out.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error',
        'Something went wrong while marking attendance. Please try again later.',
      );
      console.error('Error marking attendance:', error);
    }
  };
  return openCamera ? (
    <CameraCapture
      onPhotoCapture={markAttendance}
      buttonLabel="Mark Attendance"
    />
  ) : (
    <LinearGradient
      colors={['#141E30', '#243B55']}
      style={styles.gradientBackground}>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Attendance</Text>
          <View style={styles.placeholder} />
        </View>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TouchableOpacity
            style={checkedIn ? styles.checkoutButton : styles.checkinButton}
            onPress={handleCheckInOutPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}>
            <LinearGradient
              colors={
                checkedIn ? ['#FF5F6D', '#FFC371'] : ['#00C6FF', '#0072FF']
              }
              style={styles.gradientButton}>
              <Icon
                name={checkedIn ? 'logout' : 'login'}
                size={30}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {checkedIn ? 'Check Out' : 'Check In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        {/* Status Text */}
        <Text style={styles.statusText}>
          {checkedIn ? 'You are checked in.' : 'You are checked out.'}
        </Text>
        {/* History Section */}
        <HistoryContainer
          history={history}
          calculateWorkDuration={calculateWorkDuration}
        />
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  placeholder: {
    width: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
    width: '100%',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  checkinButton: {
    width: '100%',
  },
  checkoutButton: {
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Montserrat-Medium',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CheckInOutScreen;
