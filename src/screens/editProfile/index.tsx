import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import { useAppTheme } from '../../theme';
import { useAppSelector } from '../../redux/hooks/hooks';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, screenNames } from '../../navigation/rootNavigator/types';
import images from '../../asset/images';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile'>;

const EditProfileScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dob, setDob] = useState<Date | undefined>(undefined);

    // Role-based state variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Individual-specific state variables
    const [IND_Name, setIND_Name] = useState('');
    const [IND_Mob, setIND_Mob] = useState('');
    const [IND_Address, setIND_Address] = useState('');
    const [IND_Email, setIND_Email] = useState('');
    const [IND_DOB, setIND_DOB] = useState<Date | undefined>(undefined);

    // Leader-specific state variables
    const [lead_Name, setLead_Name] = useState('');
    const [lead_Mob, setLead_Mob] = useState('');
    const [lead_Add, setLead_Add] = useState('');
    const [lead_EmailID, setLead_EmailID] = useState('');
    const [lead_DOB, setLead_DOB] = useState<Date | undefined>(undefined);

    const [role, setRole] = useState('');
    const { employeeDetails } = useAppSelector((state) => state.employee);
    const theme = useAppTheme();
    const navigation = useNavigation<EditProfileScreenNavigationProp>();

  

        useEffect(() => {
        if (employeeDetails?.role) {
            setRole(employeeDetails.role);

            // Initialize state based on role
            if (employeeDetails.role === 'Individual') {
                setIND_Name(employeeDetails.employeeName || '');
                setIND_Mob(employeeDetails.mobileNo || '');
                setIND_Address(employeeDetails.address || '');
                setIND_Email(employeeDetails.emailID || '');
                setIND_DOB(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
            } else if (employeeDetails.role === 'Leader') {
                setLead_Name(employeeDetails.employeeName || '');
                setLead_Mob(employeeDetails.mobileNo || '');
                setLead_Add(employeeDetails.address || '');
                setLead_EmailID(employeeDetails.emailID || '');
                setLead_DOB(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
            }

            // Set the image if URL is available
            if (employeeDetails.photo) {
                setImage(employeeDetails.photo);
            }
        }
    }, [employeeDetails]);

    const handleImagePicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setFile(image);
                setImage(image.path); // Update the image source with the selected image path
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
    };

   


    const handleSaveProfile = async () => {
        const formattedDob = dob ? dob.toISOString().split('T')[0] : null;
    
        const formData = new FormData();
        if (role === 'Individual') {
            formData.append('IND_Name', IND_Name || '');
            formData.append('IND_Email', IND_Email || '');
            formData.append('IND_Address', IND_Address || '');
            formData.append('IND_DOB', IND_DOB ? IND_DOB.toISOString().split('T')[0] : '');
            formData.append('IND_Mob', IND_Mob || '');
        } else if (role === 'Leader') {
            formData.append('lead_Name', lead_Name || '');
            formData.append('lead_EmailID', lead_EmailID || '');
            formData.append('lead_Add', lead_Add || '');
            formData.append('lead_DOB', lead_DOB ? lead_DOB.toISOString().split('T')[0] : '');
            formData.append('lead_Mob', lead_Mob || '');
        }
        if (file) {
            formData.append('file', {
                uri: file.path,
                type: file.mime,
                name: file.filename || 'photo.jpg',
            });
        }
    
        console.log('Form Data:', JSON.stringify({
            name: role === 'Individual' ? IND_Name : lead_Name,
            email: role === 'Individual' ? IND_Email : lead_EmailID,
            address: role === 'Individual' ? IND_Address : lead_Add,
            dob: formattedDob,
            phoneNumber: role === 'Individual' ? IND_Mob : lead_Mob,
            file: file ? { uri: file.path, type: file.mime, name: file.filename || 'photo.jpg' } : null
        }, null, 2));
    
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
              },
        };
    
        try {
            const response = role === 'Individual'
                ? await axios.post('http://49.248.250.54:8081/api/UpdateIndividualProfile', formData, config)
                : await axios.post('http://49.248.250.54:8081/api/UpdateLeaderProfile', formData, config);
    
            console.log('Profile updated successfully:', response.data);
    
            // Navigate to Profile screen after successful update
            navigation.navigate(screenNames.profile, { userId: employeeDetails.id });
        } catch (error) {
            if (error.response) {
                console.error('Error updating profile:', error.response.data);
            } else {
                console.error('Error updating profile:', error.message);
            }
        }
    };
    
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

        const images = {
        appImages: {
            signup: require('../../asset/images/signUp/no-profile.png'), 
        },
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ position: 'relative' }}>
                    {/* <Image
                        source={file && file.path ? { uri: file.path } : { uri: image || 'http://49.248.250.54:8081/Image/default-profile.png' }}
                        style={{ width: 125, height: 125, borderRadius: 75, borderColor: '#000', borderWidth: 2 }}
                    /> */}

                        <Image
                        source={
                            file && file.path
                                ? { uri: file.path }
                                : images.appImages.signup
                        }
                  
                        style={{
                            width: 125,
                            height: 125,
                            borderRadius: 75,
                            borderColor: '#000',
                        }}
                    /> 
                    <TouchableOpacity
                        style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', borderRadius: 15, padding: 5 }}
                        onPress={handleImagePicker}>
                        <Icon name="pencil" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
                <TextInput
                    style={{ textTransform: 'uppercase', backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
                    outlineColor={theme.colors.outline}
                    mode="flat"
                    maxLength={30}
                    placeholder="Name"
                    value={role === 'Individual' ? IND_Name : lead_Name}
                    onChangeText={text => role === 'Individual' ? setIND_Name(text) : setLead_Name(text)}
                />
            </View>

            <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
                <TextInput
                    style={{ backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
                    outlineColor={theme.colors.outline}
                    mode="flat"
                    maxLength={50}
                    placeholder="Email"
                    value={role === 'Individual' ? IND_Email : lead_EmailID}
                    onChangeText={text => role === 'Individual' ? setIND_Email(text) : setLead_EmailID(text)}
                />
            </View>

            <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
                <TextInput
                    style={{ textTransform: 'uppercase', backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
                    outlineColor={theme.colors.outline}
                    mode="flat"
                    maxLength={30}
                    placeholder="Address"
                    value={role === 'Individual' ? IND_Address : lead_Add}
                    onChangeText={text => role === 'Individual' ? setIND_Address(text) : setLead_Add(text)}
                />
            </View>

            <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
                <TextInput
                    style={{ backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
                    outlineColor={theme.colors.outline}
                    mode="flat"
                    maxLength={10}
                    placeholder="Phone Number"
                    value={role === 'Individual' ? IND_Mob : lead_Mob}
                    onChangeText={text => role === 'Individual' ? setIND_Mob(text) : setLead_Mob(text)}
                />
            </View>

            <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
                <TouchableOpacity onPress={showDatepicker}>
                    <Text style={{ padding: 15, color: dob ? 'black' : 'black', borderColor: '#ccc', borderWidth: 1, backgroundColor: '#f1f1f1' }}>
                        {dob ? dob.toLocaleDateString() : 'Date of Birth'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

     

               

            <Button
                style={{ backgroundColor: theme.colors.primary, marginTop: 20, padding: 10, borderRadius: 5 }}
                icon="content-save"
                mode="contained"
                onPress={handleSaveProfile}>
                Save
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
});

export default EditProfileScreen;





// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import ImagePicker from 'react-native-image-crop-picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { TextInput, Button } from 'react-native-paper';
// import axios from 'axios';
// import { useAppTheme } from '../../theme';
// import { useAppSelector } from '../../redux/hooks/hooks';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import images from '../../asset/images';
// import { RootStackParamList, screenNames } from '../../navigation/rootNavigator/types';

// type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'profile'>;

// const EditProfileScreen = () => {
//     const [image, setImage] = useState<string | null>(null);
//     const [file, setFile] = useState<any>(null);
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [dob, setDob] = useState<Date | undefined>(undefined);

//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [address, setAddress] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');

//     // Role-based state variables
//     const [IND_Name, setIND_Name] = useState('');
//     const [IND_Mob, setIND_Mob] = useState('');
//     const [IND_Address, setIND_Address] = useState('');
//     const [IND_Email, setIND_Email] = useState('');
//     const [IND_DOB, setIND_DOB] = useState<Date | undefined>(undefined);

//     const [lead_Name, setLead_Name] = useState('');
//     const [lead_Mob, setLead_Mob] = useState('');
//     const [lead_Add, setLead_Add] = useState('');
//     const [lead_EmailID, setLead_EmailID] = useState('');
//     const [lead_DOB, setLead_DOB] = useState<Date | undefined>(undefined);

//     const [role, setRole] = useState('');
//     const { employeeDetails } = useAppSelector((state) => state.employee);
//     const theme = useAppTheme();
//     const navigation = useNavigation<EditProfileScreenNavigationProp>();

//     useEffect(() => {
//         if (employeeDetails?.role) {
//             setRole(employeeDetails.role);

//             if (employeeDetails.role === 'Individual') {
//                 setIND_Name(employeeDetails.employeeName || '');
//                 setIND_Mob(employeeDetails.mobileNo || '');
//                 setIND_Address(employeeDetails.address || '');
//                 setIND_Email(employeeDetails.emailID || '');
//                 setIND_DOB(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
//                 setDob(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
//             } else if (employeeDetails.role === 'Leader') {
//                 setLead_Name(employeeDetails.employeeName || '');
//                 setLead_Mob(employeeDetails.mobileNo || '');
//                 setLead_Add(employeeDetails.address || '');
//                 setLead_EmailID(employeeDetails.emailID || '');
//                 setLead_DOB(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
//                 setDob(employeeDetails.birthDate ? new Date(employeeDetails.birthDate) : undefined);
//             }

//             // Set the image if URL is available
//             if (employeeDetails.photo) {
//                 setImage(employeeDetails.photo);
//             }
//         }
//     }, [employeeDetails]);

//     const handleImagePicker = () => {
//         ImagePicker.openPicker({
//             width: 300,
//             height: 400,
//             cropping: true,
//         })
//             .then(image => {
//                 setFile(image);
//                 setImage(image.path); // Update the image source with the selected image path
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     };

//     const handleDateChange = (event: any, selectedDate?: Date) => {
//         const currentDate = selectedDate || dob;
//         setShowDatePicker(false);
//         setDob(currentDate);
//         if (role === 'Individual') {
//             setIND_DOB(currentDate);
//         } else if (role === 'Leader') {
//             setLead_DOB(currentDate);
//         }
//     };

//     const handleSaveProfile = async () => {
//         const formattedDob = dob ? dob.toISOString().split('T')[0] : null;

//         const formData = new FormData();
//         if (role === 'Individual') {
//             formData.append('IND_Name', IND_Name || '');
//             formData.append('IND_Email', IND_Email || '');
//             formData.append('IND_Address', IND_Address || '');
//             formData.append('IND_DOB', formattedDob || '');
//             formData.append('IND_Mob', IND_Mob || '');
//         } else if (role === 'Leader') {
//             formData.append('lead_Name', lead_Name || '');
//             formData.append('lead_EmailID', lead_EmailID || '');
//             formData.append('lead_Add', lead_Add || '');
//             formData.append('lead_DOB', formattedDob || '');
//             formData.append('lead_Mob', lead_Mob || '');
//         }
//         if (file) {
//             formData.append('file', {
//                 uri: file.path,
//                 type: file.mime,
//                 name: file.filename || 'photo.jpg',
//             });
//         }

//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 Authorization:
//                     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk5ODUzMTksImlzcyI6Imh0dHA6Ly9DaHVyY2guY29tIiwiYXVkIjoiaHR0cDovL0NodXJjaC5jb20ifQ.iJMILNigyJTfdp5LxKyMdcw8oHbUw3DqyMt5UJx0EjA',
//             },
//         };

//         try {
//             const response = role === 'Individual'
//                 ? await axios.post('http://49.248.250.54:8081/api/UpdateIndividualProfile', formData, config)
//                 : await axios.post('http://49.248.250.54:8081/api/UpdateLeaderProfile', formData, config);

//             console.log('Profile updated successfully:', response.data);

//             // Navigate to Profile screen after successful update
//             navigation.navigate(screenNames.profile, { userId: employeeDetails.id });
//         } catch (error) {
//             if (error.response) {
//                 console.error('Error updating profile:', error.response.data);
//             } else {
//                 console.error('Error updating profile:', error.message);
//             }
//         }
//     };

//     const showDatepicker = () => {
//         setShowDatePicker(true);
//     };

//     const images = {
//         appImages: {
//             signup: require('../../asset/images/signUp/no-profile.png'), 
//         },
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                 <View style={{ position: 'relative' }}>
//                     <Image
//                         source={
//                             file && file.path
//                                 ? { uri: file.path }
//                                 : image
//                                     ? { uri: image }
//                                     : images.appImages.signup
//                         }
//                         style={{
//                             width: 125,
//                             height: 125,
//                             borderRadius: 75,
//                             borderColor: '#000',
//                             borderWidth: 2,
//                         }}
//                     />
//                        {/* <Image
//                         source={
//                             file && file.path
//                                 ? { uri: file.path }
//                                 : image
//                                     ? { uri: image }
//                                     : require('../../asset/images/signUp/no-profile.png')
//                         }
//                         style={{
//                             width: 125,
//                             height: 125,
//                             borderRadius: 75,
//                             borderColor: '#000',
//                             borderWidth: 2,
//                         }}
//                     /> */}




//                     <TouchableOpacity
//                         style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', borderRadius: 15, padding: 5 }}
//                         onPress={handleImagePicker}>
//                         <Icon name="pencil" size={24} color="#fff" />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
//                 <TextInput
//                     style={{ textTransform: 'uppercase', backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
//                     outlineColor={theme.colors.outline}
//                     mode="flat"
//                     maxLength={30}
//                     placeholder="Name"
//                     value={role === 'Individual' ? IND_Name : lead_Name}
//                     onChangeText={text => role === 'Individual' ? setIND_Name(text) : setLead_Name(text)}
//                 />
//             </View>

//             <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
//                 <TextInput
//                     style={{ backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
//                     outlineColor={theme.colors.outline}
//                     mode="flat"
//                     maxLength={50}
//                     placeholder="Email"
//                     value={role === 'Individual' ? IND_Email : lead_EmailID}
//                     onChangeText={text => role === 'Individual' ? setIND_Email(text) : setLead_EmailID(text)}
//                 />
//             </View>

//             <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
//                 <TextInput
//                     style={{ backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
//                     outlineColor={theme.colors.outline}
//                     mode="flat"
//                     maxLength={30}
//                     placeholder="Mobile No"
//                     value={role === 'Individual' ? IND_Mob : lead_Mob}
//                     onChangeText={text => role === 'Individual' ? setIND_Mob(text) : setLead_Mob(text)}
//                 />
//             </View>

//             <View style={{ marginTop: 10, gap: 5, backgroundColor: theme.colors.background }}>
//                 <TextInput
//                     style={{ backgroundColor: '#f1f1f1', color: theme.colors.onBackground, borderWidth: 0.2, borderColor: 'grey' }}
//                     outlineColor={theme.colors.outline}
//                     mode="flat"
//                     maxLength={100}
//                     placeholder="Address"
//                     value={role === 'Individual' ? IND_Address : lead_Add}
//                     onChangeText={text => role === 'Individual' ? setIND_Address(text) : setLead_Add(text)}
//                 />
//             </View>


// <View style={{marginTop: 10,}}>
//             <TouchableOpacity onPress={showDatepicker}>
//                 <TextInput
//                     style={{
//                         textTransform: 'uppercase',
//                         backgroundColor: '#f1f1f1',
//                         color: theme.colors.onBackground,
//                         borderWidth: 0.2,
//                         borderColor: 'grey',
//                         paddingVertical: Platform.OS === 'android' ? 5 : 10,
//                     }}
//                     outlineColor={theme.colors.outline}
//                     mode="flat"
//                     maxLength={30}
//                     placeholder="Date of Birth"
//                     value={dob ? dob.toISOString().split('T')[0] : ''}
//                     editable={false}
//                 />
//             </TouchableOpacity>

//             {showDatePicker && (
//                 <DateTimePicker
//                     value={dob || new Date()}
//                     mode="date"
//                     display="default"
//                     onChange={handleDateChange}
//                     maximumDate={new Date()}
//                 />
//             )}
//             </View>

//             <Button
//                 mode="contained"
//                 style={{ marginTop: 20, backgroundColor: 'black' }}
//                 onPress={handleSaveProfile}
//             >
//                 Save
//             </Button>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
// });

// export default EditProfileScreen;








