import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import FileViewer from 'react-native-file-viewer';

interface Asset {
  uri: string;
  mime?: string;
  path?: string;
  name: string;
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedMedia: {
    width: width - 40,
    height: width - 40,
  },
  fileContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

interface AssetProps {
  item: Asset;
}

const AssetRenderer: React.FC<AssetProps> = ({item}) => {
  const openFile = async () => {
    try {
      await FileViewer.open(item.uri);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  if ('uri' in item || 'path' in item) {
    switch (item.mime?.split('/')[0]) {
      case 'image':
        return (
          <Image
            style={styles.selectedMedia}
            resizeMode="cover"
            resizeMethod="resize"
            source={{uri: item.path || item.uri}}
          />
        );
      case 'video':
        return (
          <Video
            style={styles.selectedMedia}
            source={{uri: item.path || item.uri}}
            playWhenInactive={false}
            resizeMode="contain"
            controls={false}
          />
        );
      default:
        return (
          <TouchableOpacity
            style={[
              styles.selectedMedia,
              {alignItems: 'center', justifyContent: 'center'},
            ]}
            onPress={openFile}>
            <View style={styles.fileContainer}>
              <Text style={styles.fileName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
    }
  } else if ('imageUrl' in item) {
    // Handle the new array structure
    return (
      <TouchableOpacity
        style={[
          styles.selectedMedia,
          {alignItems: 'center', justifyContent: 'center'},
        ]}
        onPress={() => console.log('Pressed image:', item)}>
        <Image
          style={styles.selectedMedia}
          resizeMode="cover"
          source={{uri: item.imageUrl}}
        />
      </TouchableOpacity>
    );
  } else if ('videoUrl' in item) {
    // Handle the new array structure
    return (
      <Video
        style={styles.selectedMedia}
        source={{uri: item.videoUrl}}
        playWhenInactive={false}
        resizeMode="contain"
        controls={false}
      />
    );
  } else if ('fileUrl' in item) {
    // Handle the new array structure
    return (
      <TouchableOpacity
        style={[
          styles.selectedMedia,
          {alignItems: 'center', justifyContent: 'center'},
        ]}
        onPress={() => console.log('Pressed image:', item)}>
        <Image
          style={styles.selectedMedia}
          resizeMode="cover"
          source={{uri: item.fileUrl}}
        />
      </TouchableOpacity>
    );
  }
};

interface AssetFlatListProps {
  data: Asset[];
}

const AssetFlatList: React.FC<AssetFlatListProps> = ({data}) => {
  if (!data || data.length === 0) {
    console.log('No data to display');
    return <Text>No data to display</Text>;
  }

  console.log('Data to display:', data);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        pagingEnabled
        data={data}
        renderItem={({item}) => <AssetRenderer item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default AssetFlatList;
