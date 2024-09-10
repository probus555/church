// BottomPanel.tsx
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useBottomPanel from './useBottomPanel';
import {useStyles} from './useStyles';
interface BottomPanelProps {
  onMediaSelected: (media: any) => void; // Adjust the type of media accordingly
  onCreate: (media: any) => void;
  btnLabel:string
}
const BottomPanel: React.FC<BottomPanelProps> = ({
  onMediaSelected,
  onCreate,
  btnLabel='create'
}) => {  
  const {
    handlePickImage,
    handlePickVideo,
    handlePickDocument,
    handleOpenCamera,
    selectedMedia,
    resetSelectedMedia,
  } = useBottomPanel();
  const styles = useStyles();
  React.useEffect(() => {
    if (selectedMedia) {
      onMediaSelected(selectedMedia);
    }
  }, [selectedMedia]);

  return (
    <View style={styles.container}>
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity style={{marginRight: 20}} onPress={handlePickImage}>
          <Icon name="image" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 20}} onPress={handleOpenCamera}>
          <Icon name="camera" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 20}} onPress={handlePickVideo}>
          <Icon name="videocam" size={30} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickDocument}>
          <Icon name="document" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.postButton} onPress={onCreate}>
        <Text style={styles.postButtonText}>{btnLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomPanel;
