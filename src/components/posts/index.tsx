import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import Video from 'react-native-video';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import Metrics from '../../theme/metrics/screen';
import fontStyles from '../../theme/fonts/fontStyles';
// import appImages from '../../../assets/images';
import { isIos } from '../../common/utils/config';
// import Text from '../../Text';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useDeletePostMutation,useDeleteNewsMutation,useDeleteEventMutation,} from '../../redux/services/community';
import DeviceInfo from 'react-native-device-info';
import {OptionsMenu} from './components/OptionMenu';
import UserInfo from './components/UserInfo';
import VideoPlayer from '../media/VideoPlayer';
import { NavigationActionType, screenNames } from '../../navigation/rootNavigator/types';
import images from '../../asset/images';

const PostCard = ({
  createdBy,
  createdDate,
  title,
  description,
  image,
  video,
  file,
  profileUrl,
  id,
  type
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationActionType>();
  const [deletePost, deletePostResult] = useDeletePostMutation();
  const [deleteNews, deleteNewsResult] = useDeleteNewsMutation();
  const [deleteEvent, deleteEventResult] = useDeleteEventMutation();
  useFocusEffect(
    useCallback(() => {
      console.log('Component focused');
      setIsVideoPaused(false); // Video should play when component is focused

      return () => {
        console.log('Component blurred');
        setIsVideoPaused(true); // Video should pause when component loses focus
      };
    }, [isFocused]),
  );
  const editPost = () => {
    setModalVisible(false)
    navigation.navigate(screenNames.createPost, {
      mode: 'edit',
      title,
      description,
      assets: [...image, ...video, ...file],
      screenTitle:type,
      postId:id
    });
  };
  const handleDelete = async () => {
    setModalVisible(false);
    const machineId = DeviceInfo.getDeviceId();
    const machineIp = await DeviceInfo.getIpAddress();
  
    switch (type) {
      case 'News':
        await deleteNews({ id, machineId, machineIp });
        break;
      case 'Event':
        await deleteEvent({ id, machineId, machineIp });
        break;
      case 'Notice':
        await deletePost({ id, machineId, machineIp });
        break;
      default:
        console.warn('Unsupported post type for deletion');
        break;
    }
  };
  
  const scrollViewRef = useRef(null);
  const totalAssets =
    (image ? image.length : 0) +
    (video ? video.length : 0) +
    (file ? file.length : 0);
  const windowWidth = Dimensions.get('window').width;
  const CARD_WIDTH = windowWidth 

  const openFile = async fileUrl => {
    try {
      // Use Linking API to open the file URL directly
      if (isIos) {
        // On iOS, use the Safari view controller to open the URL
        Linking.openURL(fileUrl);
      } else {
        // On Android, use the default browser to open the URL
        Linking.openURL(fileUrl);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  return (
 
     <View>
      <View style={styles.card}>
        {/* <UserInfo createdBy={createdBy} createdDate={createdDate} profileUrl={profileUrl} /> */}
        <TouchableWithoutFeedback onPress={()=>{if(modalVisible){setModalVisible(false)}}}>
      <View style={styles.textContainer}>
        <View style={styles.userInfo}>
          <Image source={profileUrl?{uri: profileUrl}:images.appImages.noProfile} style={styles.userImage} />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{createdBy}</Text>
            <Text style={styles.creationDate}>{createdDate}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon
              name="ellipsis-v"
              size={20}
              color="#000"
              style={{marginRight: 5}}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{title}</Text>
        {description&&<Text style={styles.description}>{description}</Text>}
        {/* Render assets horizontally */}
        </View>
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <ScrollView
          onTouchStart={()=>{if(modalVisible){setModalVisible(false)}}}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.assetsContainer}
            ref={scrollViewRef}
            pagingEnabled
            onScroll={event => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / CARD_WIDTH);
              setActiveIndex(index);
            }}>
            {image &&
              image.map((img, index) => (
                <Image
                  key={index}
                  style={styles.asset}
                  source={{uri: img.imageUrl}}
                  resizeMethod="resize"
                  resizeMode="cover"
                />
              ))}
            {video &&
              video.map((vid, index) => (
                <VideoPlayer key={index} source={{uri: vid.videoUrl}} />
                // <Video
                //   key={index}
                //   playInBackground={false}
                //   playWhenInactive={false}
                //   pictureInPicture
                //   collapsable
                //   paused={isVideoPaused}
                //   style={styles.asset}
                //   source={{uri: vid.videoUrl}}
                //   resizeMode="contain"
                // />
              ))}
            {file &&
              file.map((f, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.touchableOpacityStyle}
                  onPress={() => {
                    setIsFileOpen(!isFileOpen);
                    openFile(f.fileUrl);
                  }}>
                  <View style={styles.fileContainer}>
                    <Icon name="file" size={50} color="#2c3e50" />
                    {/* Customize the icon name, size, and color */}
                    <Text style={styles.fileName}>{f.fileName}</Text>
                    {/* Display file name */}
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
          {totalAssets > 0 && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'grey',
                top: 10,
                right: 20,
                zIndex: 999,
                borderRadius: 10,
                padding: 5,
              }}>
              <Text
                style={{color: 'white', fontWeight: fontStyles.weight.bold}}>
                {`${activeIndex + 1}/${totalAssets}`}
              </Text>
            </View>
          )}
        </View>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {Array.from({length: totalAssets}, (_, i) => (
            <View
              key={i}
              style={[
                styles.paginationDot,
                {backgroundColor: activeIndex === i ? '#000' : '#ccc'},
              ]}
            />
          ))}
        </View>
        {/* Modal for edit, delete, report options */}
        {modalVisible && (
          <OptionsMenu onDelete={handleDelete} onEdit={editPost}  />
        )}
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    // borderBottomWidth: 5,
    // borderBottomColor: 'rgb(200,200,200)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set your desired background color
    position: 'relative', // Ensure the container covers the whole screen
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items and three dots icon
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  asset: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth,
  
  },
  assetsContainer: {
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    width: 120, // Adjust width as needed
    marginTop: 50, // Adjust marginTop as needed
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  optionsContainer: {flexDirection: 'row', gap: 5},
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  postCount: {
    textAlign: 'center',
    marginTop: 10,
  },
  touchableOpacityStyle: {
    width: Metrics.screenWidth ,
    height: 200,
    alignItems: 'center',
    marginBottom: 20,
  },
  fileContainer: {
    width: '90%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1', // Background color for the file container
    borderRadius: 10, // Add border radius for a rounded look
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50', // Color for the file name
  },
  textContainer:{
    padding:10
  }
});

export default PostCard;
