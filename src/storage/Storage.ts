// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('async storg key added successfully  ');
  } catch (e) {
    console.error('Failed to save the data to the storage', e);
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Failed to fetch the data from storage', e);
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove the data from storage', e);
  }
};
