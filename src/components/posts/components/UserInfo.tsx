// UserInfo.tsx

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Text from '../../../Text';
// Adjust the path as per your project structure

interface UserInfoProps {
  createdBy: string;
  createdDate: string;
  profileUrl: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  createdBy,
  createdDate,
  profileUrl,
}) => {
  return (
    <View style={styles.userInfo}>
      <Image source={{ uri: profileUrl }} style={styles.userImage} />
      <View style={styles.userInfoText}>
        <Text style={styles.userName}>{createdBy}</Text>
        <Text style={styles.creationDate}>{createdDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creationDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserInfo;
