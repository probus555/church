// useBottomPanel.ts
import {useState} from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import ImagePicker, {Image} from 'react-native-image-crop-picker';

type MediaType = 'image' | 'video' | 'document';

interface MediaData {
  data: [];
}


const useBottomPanel = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaData | []>([]);
  // console.log('selected media from bottom pannel',selectedMedia)
  const updateSelectedMedia = async (media: []) => {
    try {
      setSelectedMedia(media);
    } catch (error) {
      console.log('Error updating selected media: ', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1080, // Use a higher resolution
        height: 1350, 
        cropping: true,
        mediaType: 'photo',
        multiple: true,
      });
      updateSelectedMedia(image);
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 1080, // Use a higher resolution
        height: 1350, 
        // cropping: true,
        mediaType: 'photo',
        multiple: true,
      });
      updateSelectedMedia([image]);
    } catch (error) {
      console.log('Error opening camera: ', error);
    }
  };

  const handlePickVideo = async () => {
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
        multiple: true,
      });
      updateSelectedMedia(video);
    } catch (error) {
      console.log('Error picking video: ', error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      updateSelectedMedia(document);
    } catch (error) {
      console.log('Error picking document: ', error);
    }
  };

  const resetSelectedMedia = () => {
    setSelectedMedia([]);
  };

  return {
    selectedMedia,
    handlePickImage,
    handleOpenCamera,
    handlePickVideo,
    handlePickDocument,
    resetSelectedMedia,
  };
};

export default useBottomPanel;
