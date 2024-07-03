import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '../../../theme';
import useStyles from './useStyles';
import { Button, Divider, TextInput } from 'react-native-paper';
import { Text } from '../../../components/Text/Text';
import DropdownComponent from '../../../components/dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList, screenNames } from '../../../navigation/rootNavigator/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Header from './header';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const SignUp: React.FC = () => {
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateb, setDateb] = useState(new Date());
  const [show, setShow] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [churches, setChurches] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [macID, setMacID] = useState('');
  const [macIP, setMacIP] = useState('');
  const [mAS_CHC_FID, setMAS_CHC_FID] = useState('');
  const [iND_Name, setIND_Name] = useState('');
  const [iND_Mob, setIND_Mob] = useState('');
  const [iND_Email, setIND_Email] = useState('');
  const [iND_Address, setIND_Address] = useState('');
  const [iND_DOJ, setIND_DOJ] = useState('');
  const [iND_DOB, setIND_DOB] = useState('');
  const [iND_ReffName, setIND_ReffName] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const [nameAsAadhar, setNameAsAadhar] = useState('');
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const avatarImage = { uri: 'path_to_default_avatar_image' };

  const styles = useStyles();
  const navigation = useNavigation<RootStackParamList>();
  const theme = useAppTheme();

  useEffect(() => {
    fetchDeviceId();
    fetchIpAddress();
  }, []);

  const fetchDeviceId = async () => {
    try {
      const id = DeviceInfo.getDeviceId();
      setMacID(id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
    }
  };

  const fetchIpAddress = async () => {
    try {
      const ip = await DeviceInfo.getIpAddress();
      setMacIP(ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };



  const fetchStates = async () => {
    try {
      const response = await axios.get('http://97.74.95.178:8080/api/GetState', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
        },
      });
      if (response.data.status === 200) {
        const mappedStates = response.data.data.map(state => ({
          label: state.name,
          value: state.id,
        }));
        setStates(mappedStates);
        console.log(mappedStates); // Log the mapped list of states to the console
      } else {
        console.error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchCities = async stateId => {
    try {
      const response = await axios.get(`http://97.74.95.178:8080/api/GetCity?StateId=${stateId}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
        },
      });
      if (response.data.status === 200) {
        const mappedCities = response.data.data.map(city => ({
          label: city.name,
          value: city.id,
        }));
        setCities(mappedCities);
        console.log(mappedCities); // Log the mapped list of cities to the console
      } else {
        console.error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchChurches = async (stateId, cityName) => {
    try {
      const response = await fetch(
        `http://97.74.95.178:8080/api/GetChurch?StateId=${stateId}&MasCityName=${cityName}`,
        {
          method: 'GET',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
          },
        },
      );
      const result = await response.json();
      if (result.status === 200) {
        const mappedChurches = result.data.map(church => ({
          label: church.name,
          value: church.id,
        }));
        setChurches(mappedChurches);
        console.log(mappedChurches); // Log the mapped list of churches to the console
      } else {
        console.error('Failed to fetch churches');
      }
    } catch (error) {
      console.error('Error fetching churches:', error);
    }
  };


  const onStateChange = state => {
    setSelectedState(state);
    fetchCities(state.value);
  };

  const onCityChange = city => {
    setSelectedCity(city);
    if (selectedState) {
      fetchChurches(selectedState.value, city.label);
    }
  };

  const onDayPress = day => {
    setIND_DOJ(day.dateString);
    setDate(day.dateString);
    setShowCalendar(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateb;
    setShow(Platform.OS === 'ios');
    setDateb(currentDate);

    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    setIND_DOB(formattedDate);
  };

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setFile(image); // Store the whole image object
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('macID', macID);
      formData.append('macIP', macIP);
      formData.append('mAS_CHC_FID', mAS_CHC_FID);
      formData.append('iND_Name', iND_Name);
      formData.append('iND_Mob', iND_Mob);
      formData.append('iND_Email', iND_Email);
      formData.append('iND_Address', iND_Address);
      formData.append('iND_DOJ', iND_DOJ);
      formData.append('iND_DOB', iND_DOB);
      formData.append('iND_ReffName', iND_ReffName);
      formData.append('adharNo', adharNo);
      formData.append('nameAsAadhar', nameAsAadhar);
      if (file) {
        formData.append('file', {
          uri: file.path,
          name: 'image.jpg', // You can change the name and extension based on your needs
          type: file.mime,
        });
      }
  
      // Log the formData before sending
      console.log('FormData:', formData);
  
      const response = await axios.post('http://97.74.95.178:8080/api/NewRegistration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
        },
      });
  
      if (response.data.status === 200) {
        alert('Data submitted successfully');
        navigation.replace(screenNames.login);
        console.log('Success:', response.data);
      } else {
        alert('Error submitting data');
        console.log('Failure:', response.data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };


  
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.card}>
            <Text variant="displaySmall" style={styles.loginText}>
              Registration Form
            </Text>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{position: 'relative'}}>
                <Image
                  source={file ? {uri: file.path} : avatarImage}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#000',
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#000',
                    borderRadius: 15,
                    padding: 5,
                  }}
                  onPress={handleImagePicker}>
                  <Icon name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputFieldsContainer}>
                  <TextInput
                    mode="flat"
                    style={styles.inputText}
                    placeholder="Full Name"
                    outlineColor={theme.colors.outline}
                    autoCapitalize="characters"
                    value={iND_Name}
                    onChangeText={text => setIND_Name(text)}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>State Name</Text>
                <View>
                  <DropdownComponent
                    data={states}
                    placeholder="Select State"
                    labelField={'label'}
                    valueField={'value'}
                    onChange={onStateChange}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>City Name</Text>
                <View>
                  <DropdownComponent
                    data={cities}
                    placeholder="Select City"
                    labelField={'label'}
                    valueField={'value'}
                    onChange={onCityChange}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.inputLabel}>Church Name</Text>
                <View>
                  <DropdownComponent
                    data={churches}
                    placeholder="Select Church"
                    labelField={'label'}
                    valueField={'value'}
                  
                  />
                </View>
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Contact Number</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="999-555-5544"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={iND_Mob}
                  onChangeText={text => setIND_Mob(text)}
                />
              </View>

              <View>
                <View>
                  <Text style={styles.inputLabel}>Date Of Birth</Text>
                  <TouchableOpacity
                    onPress={showDatepicker}
                    style={{
                      padding: 15,
                      paddingHorizontal: 10,
                      borderWidth: 0.25,
                      borderColor: 'grey',
                      backgroundColor: '#f1f1f1',
                      // borderRadius: 5,
                      height: 55,
                    }}>
                    {/* <Text> {dateb.toLocaleDateString()}</Text> */}
                    <Text style={{marginLeft: 5}}>
                      {iND_DOB || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dateb}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Email Id</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Enter Emai ID"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={iND_Email}
                  onChangeText={text => setIND_Email(text)}
                />
              </View>
              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Adhar Number</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Enter-Address"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={adharNo}
                  onChangeText={text => setAdharNo(text)}
                />
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Name As Per Adhar</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Name as Per Adhar"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={nameAsAadhar}
                  onChangeText={text => setNameAsAadhar(text)}
                />
              </View>

              {/* <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Registration Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowCalendar(true)}>
                  <Text style={{marginLeft: 5}}>
                    {date ? date : 'YYYY-MM-DD'}
                  </Text>
                </TouchableOpacity>

                <Modal
                  visible={showCalendar}
                  transparent={true}
                  animationType="slide">
                  <View style={styles.modalBackground}>
                    <View style={styles.calendarContainer}>
                      <Calendar
                        onDayPress={onDayPress}
                        markedDates={{
                          [iND_DOJ]: {
                            selected: true,
                            marked: true,
                            selectedColor: 'blue',
                          },
                        }}
                      />
                      <Button
                        title="Close"
                        onPress={() => setShowCalendar(false)}
                      />
                    </View>
                  </View>
                </Modal>
              </View> */}

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Address"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={iND_Address}
                  onChangeText={text => setIND_Address(text)}
                />
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Reference Name</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Reference Name"
                  outlineColor={theme.colors.outline}
                  autoCapitalize="characters"
                  value={iND_ReffName}
                  onChangeText={text => setIND_ReffName(text)}
                />
              </View>

              <View style={[styles.inputWrapper, {flex: 1}]}>
                <View style={styles.selectedFileContainer}></View>
              </View>

              <Button mode="contained" onPress={handleSubmit}>
                CREATE
              </Button>

              <Divider />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

