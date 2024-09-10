import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {useAppTheme} from '../../../theme';
import useStyles from './useStyles';
import {Button, Divider, TextInput} from 'react-native-paper';
import {Text} from '../../../components/Text/Text';
import DropdownComponent from '../../../components/dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  RootStackParamList,
  screenNames,
} from '../../../navigation/rootNavigator/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Header from './header';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../../asset/images';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

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
  const [Gender, setGender] = useState('');
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const avatarImage = {uri: 'path_to_default_avatar_image'};

  const styles = useStyles();
  const navigation = useNavigation<RootStackParamList>();
  const theme = useAppTheme();

  useEffect(() => {
    fetchDeviceId();
    // fetchIpAddress();
  }, []);

  const fetchDeviceId = async () => {
    try {
      const id = DeviceInfo.getDeviceId();
      setMacID(id);
    } catch (error) {
      console.error('Error fetching device ID:', error);
    }
  };

  useEffect(() => {
    DeviceInfo.getIpAddress()
      .then(ip => {
        console.log('Retrieved IP address:', ip); // Log the IP address
        setMacIP(ip); // Update the state with the retrieved IP address
      })
      .catch(error => {
        console.error('Failed to get IP address:', error); // Handle any errors
      });
  }, []);

  const validateForm = () => {
    if (!iND_Name.trim()) {
      Alert.alert('Validation Error', 'Full Name is required');
      return false;
    }

    if (!iND_Mob.trim()) {
      Alert.alert('Validation Error', 'Contact Number is required');
      return false;
    }

    // Check for valid international phone number format
    const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!internationalPhoneRegex.test(iND_Mob)) {
      Alert.alert('Validation Error', 'Invalid Contact Number');
      return false;
    }

    if (!iND_Email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(iND_Email)) {
      Alert.alert('Validation Error', 'Invalid Email Address');
      return false;
    }

    if (!iND_Address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }

    if (!iND_DOB.trim()) {
      Alert.alert('Validation Error', 'Date Of Birth is required');
      return false;
    }

    const today = new Date();
    const birthDate = new Date(iND_DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      Alert.alert('Validation Error', 'You must be at least 18 years old');
      return false;
    }

    if (!Gender.trim()) {
      Alert.alert('Validation Error', 'Gender is required');
      return false;
    }

    if (!adharNo.trim()) {
      Alert.alert('Validation Error', 'Aadhaar Number is required');
      return false;
    }

    // Check for valid Aadhaar number format (12-digit number)
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(adharNo)) {
      Alert.alert('Validation Error', 'Invalid Aadhaar Number');
      return false;
    }

    return true;
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        'http://49.248.250.54:8081/api/GetState',
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
          },
        },
      );
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
      const response = await axios.get(
        `http://49.248.250.54:8081/api/GetCity?StateId=${stateId}`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
          },
        },
      );
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
        `http://49.248.250.54:8081/api/GetChurch?StateId=${stateId}&MasCityName=${cityName}`,
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

  // const fetchChurchId = church => {
  //   setMAS_CHC_FID(mAS_CHC_FID);
  //   if (mAS_CHC_FID) {
  //     fetchChurches(selectedState.value, city.label,church.id);
  //   }
  // };

  const fetchChurchId = church => {
    setMAS_CHC_FID(church.value); // Correctly set the selected church ID
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
  console.log('church', churches);

  const handleSubmit = async () => {
    if (validateForm()) {
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
        formData.append('Gender', Gender);

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

        const response = await axios.post(
          'http://49.248.250.54:8081/api/NewRegistration',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
            },
          },
        );

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
    }
  };

  

  const images = {
    appImages: {
      signup: require('../../../asset/images/signUp/no-profile.png'), // Adjust the path to your image
    },
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
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <View style={{position: 'relative'}}>
                <Image
                  source={
                    file && file.path
                      ? {uri: file.path}
                      : images.appImages.signup
                  }
                  // source={file ? {uri: file.path} : avatarImage}
                  style={{
                    width: 125,
                    height: 125,
                    borderRadius: 75,
                    // borderWidth: 2,
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
                    // autoCapitalize="characters"
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
                    search
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
                    search
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
                    onChange={fetchChurchId}
                    search
                  />
                </View>
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Contact Number</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  keyboardType="numeric"
                  inputMode="numeric"
                  placeholder="999-555-5544"
                  maxLength={10}
                  outlineColor={theme.colors.outline}
                  // autoCapitalize="characters"
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

              <View>
                <Text style={styles.inputLabel}>Gender</Text>
                <View
                  style={{
                    gap: 5,
                    backgroundColor: '#f1f1f1',
                    color: theme.colors.onBackground,
                    borderWidth: 0.2,
                  }}>
                  <Picker
                    selectedValue={Gender}
                    style={{height: 50, width: '100%', color: 'black'}}
                    onValueChange={itemValue => setGender(itemValue)}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Email Id</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Enter Emai ID"
                  outlineColor={theme.colors.outline}
                  // autoCapitalize="characters"
                  value={iND_Email}
                  onChangeText={text => setIND_Email(text)}
                />
              </View>
              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Adhar Number</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Adhar Number"
                  maxLength={12}
                  outlineColor={theme.colors.outline}
                  keyboardType="numeric"
                  inputMode="numeric"
                  value={adharNo}
                  onChangeText={text => setAdharNo(text)}
                />
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Name As Per Adhar</Text>
                <TextInput
                  mode="flat"
                  maxLength={50}
                  style={styles.inputText}
                  placeholder="Name as Per Adhar"
                  outlineColor={theme.colors.outline}
                  // autoCapitalize="characters"
                  value={nameAsAadhar}
                  onChangeText={text => setNameAsAadhar(text)}
                />
              </View>

              <View style={styles.inputFieldsContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Address"
                  outlineColor={theme.colors.outline}
                  // autoCapitalize="characters"
                  value={iND_Address}
                  onChangeText={text => setIND_Address(text)}
                />
              </View>

              <View style={[styles.inputWrapper, {flex: 1}]}>
                <View style={styles.selectedFileContainer}></View>
              </View>

              <Button mode="contained" onPress={handleSubmit}>
                REGISTER
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
