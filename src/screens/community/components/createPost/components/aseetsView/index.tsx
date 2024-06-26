import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { FileViewer } from 'react-native-file-viewer';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  selectedMedia: {
    width: width - 40, // Adjust width as needed
    height: 200, // Adjust height as needed
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

const AssetRenderer = ({ item }) => {
  const [isFileOpen, setIsFileOpen] = useState(false);

  const mime = item.mime ? item.mime.split('/')[0] : 'application'; // Extracting the type from mime

  const openFile = async () => {
    try {
      await FileViewer.open(item.path);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const toggleFileView = () => {
    setIsFileOpen(!isFileOpen);
  };

  let content = null;

  switch (mime) {
    case 'image':
      content = <Image style={styles.selectedMedia} resizeMode='cover' source={{ uri: item.path }} />;
      break;
    case 'video':
      content = <Video style={styles.selectedMedia} source={{ uri: item.path }} controls={true} />;
      break;
    case 'application':
      content = (
        <TouchableOpacity onPress={toggleFileView}>
          <View style={styles.fileContainer}>
            <Text style={styles.fileName}>{item.name}</Text>
            {isFileOpen && <FileViewer fileType={item.mime} filePath={item.path} />}
          </View>
        </TouchableOpacity>
      );
      break;
    default:
      break;
  }

  return content;
};

export default AssetRenderer;
