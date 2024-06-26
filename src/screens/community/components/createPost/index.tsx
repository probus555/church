import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStyles} from './useStyles';
import BottomPanel from './components/bottomPanel';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/core';
import {NavigationActionType} from '../../../../navigation/rootNavigator/types';
import {ScrollView} from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import Video from 'react-native-video';
import useCreatePostScreen from './useCreatePost';
import AssetFlatList from './components/mediaCarousal';
import LoadingIndicator from '../../../../components/loadingIndicator/LoadingIndicator';
type SelectedMedia = {
  type: 'image' | 'video' | 'document';
  data: {path: string};
};

type RouteParams = {
  title?: string;
  screenTitle: string;
};

type Props = {};

const CreatePostScreen: React.FC<Props> = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<NavigationActionType>();

  const styles = useStyles();
  const {
    title,
    description,
    selectedMedia,
    handleTitleChange,
    handleDescriptionChange,
    handleMediaSelected,
    handleCancelMedia,
    clearFields,
    onCreate,
    createNoticeResult,
    screenTitle,
    mode,
    editPostResult,
    loading
  } = useCreatePostScreen();

  useEffect(() => {
    navigation.setOptions({
      title: `${mode === 'create' ? 'Create' : 'Edit'} ${
        screenTitle ?? 'Post'
      }`,
    });
  }, [navigation, mode, screenTitle]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <LoadingIndicator
        loading={createNoticeResult.isLoading||editPostResult.isLoading||loading}
        text={mode === 'create'?"creating":'saving'}
      />
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>{mode === 'create' ? 'Create' : 'Edit'} {screenTitle}</Text>
          <TextInput
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Title"
            style={styles.textInput}
          />
          <TextInput
            placeholder="Description"
            multiline
            value={description}
            numberOfLines={4}
            style={styles.descriptionInput}
            onChangeText={handleDescriptionChange}
          />
          {selectedMedia.length > 0 && (
            <View style={styles.selectedMediaContainer}>
              <AssetFlatList data={selectedMedia}  />
              <TouchableOpacity
                onPress={handleCancelMedia}
                style={styles.cancelButton}>
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomPanel btnLabel={mode=='edit'?'save':'create'}  onMediaSelected={handleMediaSelected} onCreate={onCreate} />
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;
