import {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  useCreateEventMutation,
  useCreateNewsMutation,
  useCreateNoticeMutation,
  useEditNoticeMutation,
} from '../../../../redux/services/community';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {setSnackMessage} from '../../../../redux/slices/snackbarSlice';
import {useAppDispatch} from '../../../../redux/hooks/hooks';
import {NavigationActionType} from '../../../../navigation/rootNavigator/types';

interface CreatePostScreenHook {
  title: string;
  description: string;
  selectedMedia: any[];
  handleTitleChange: (text: string) => void;
  handleDescriptionChange: (text: string) => void;
  handleMediaSelected: (media: any[]) => void;
  handleCancelMedia: () => void;
  clearFields: () => void;
  onCreate: () => void;
  createNoticeResult: any;
  editPostResult: any;
  mode: 'create' | 'edit';
  screenTitle: string;
  loading: boolean;
}

type RouteParams = {
  mode: 'create' | 'edit';
  title?: string;
  description?: string;
  assets?: any[];
  screenTitle: string;
  postId: string;
};

const useCreatePostScreen = (): CreatePostScreenHook => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const {
    mode,
    title: initialTitle = '',
    description: initialDescription = '',
    assets: initialAssets = [],
    screenTitle,
    postId = '',
  } = route.params ?? {mode: 'create'};

  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [selectedMedia, setSelectedMedia] = useState<any[]>(initialAssets);
  const [createNotice, createNoticeResult] = useCreateNoticeMutation();
  const [editPost, editPostResult] = useEditNoticeMutation();
  const [createNews, createNewsResult] = useCreateNewsMutation();
  const [createEvent, createEventResult] = useCreateEventMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationActionType>();

  useEffect(() => {
    const handleResult = (result: any) => {
      if (result.isSuccess && result.data?.message) {
        dispatch(setSnackMessage(result.data.message));
        clearFields();
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      } else if (result.isError && result.error?.data?.message) {
        dispatch(setSnackMessage(result.error.data.message));
      }
      setLoading(false); // Ensure loading indicator is turned off
    };

    if (mode === 'create') {
      if (screenTitle === 'News') {
        handleResult(createNewsResult);
      } else if (screenTitle === 'Event') {
        handleResult(createEventResult);
      } else {
        handleResult(createNoticeResult);
      }
    } else if (mode === 'edit') {
      if (screenTitle === 'News') {
        handleResult(editPostResult); // Assuming edit for news is handled similarly
      } else if (screenTitle === 'Event') {
        handleResult(editPostResult); // Assuming edit for events is handled similarly
      } else {
        handleResult(editPostResult); // Default to handle edit post for other cases
      }
    }
  }, [
    createNoticeResult.isSuccess,
    createNoticeResult.isError,
    createNoticeResult.data,
    createNoticeResult.error,
    editPostResult.isSuccess,
    editPostResult.isError,
    editPostResult.data,
    editPostResult.error,
    createNewsResult.isSuccess,
    createNewsResult.isError,
    createNewsResult.data,
    createNewsResult.error,
    createEventResult.isSuccess,
    createEventResult.isError,
    createEventResult.data,
    createEventResult.error,
  ]);

  const handleTitleChange = (text: string): void => setTitle(text);
  const handleDescriptionChange = (text: string): void => setDescription(text);

  const handleMediaSelected = (media: any[]): void => {
    setSelectedMedia(prevMedia => [...prevMedia, ...media]);
  };

  const handleCancelMedia = (): void => setSelectedMedia([]);

  const clearFields = (): void => {
    setTitle('');
    setDescription('');
    setSelectedMedia([]);
  };

  const generateUniqueName = (originalName: string): string => {
    const timestamp = new Date().getTime();
    const extension = originalName.split('.').pop();
    return `${screenTitle}_${timestamp}.${extension}`;
  };

  const generatePayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineId', machineId);
    payload.append('machineIP', machineIP);
    payload.append('noticeTitle', title);
    payload.append('noticeDescription', description ?? '');
    payload.append('createdDate', new Date().toISOString());

    selectedMedia.forEach((media, index) => {
      const mediaFile = {
        uri: media.path || media.uri,
        type: media.mime || media.type,
        name:
          media.path && media.mime && media.mime.startsWith('image')
            ? `${new Date().getTime()}_${index}.jpg`
            : media.path && media.mime && media.mime.startsWith('video')
            ? `${new Date().getTime()}_${index}.mp4`
            : `${media.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
      };
      payload.append(
        media.mime && media.mime.startsWith('image')
          ? 'images'
          : media.mime && media.mime.startsWith('video')
          ? 'videos'
          : 'files',
        mediaFile,
      );
    });

    return payload;
  };
  const generateNewsPayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineName', machineId); // Replace with actual machine name
    payload.append('machineIP', machineIP);
    payload.append('newsTitle', title);
    payload.append('newsDescripation', description ?? '');
    payload.append('createdDate', new Date().toISOString());

    selectedMedia.forEach((media, index) => {
      const mediaFile = {
        uri: media.path || media.uri,
        type: media.mime || media.type,
        name:
          media.path && media.mime && media.mime.startsWith('image')
            ? `${new Date().getTime()}_${index}.jpg`
            : media.path && media.mime && media.mime.startsWith('video')
            ? `${new Date().getTime()}_${index}.mp4`
            : `${media.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
      };
      payload.append(
        media.mime && media.mime.startsWith('image')
          ? 'images'
          : media.mime && media.mime.startsWith('video')
          ? 'videos'
          : 'files',
        mediaFile,
      );
    });

    return payload;
  };

  const generateEditPostPayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineId', machineId);
    payload.append('machineIP', machineIP);
    payload.append('noticeTitle', title);
    payload.append('noticeDescription', description ?? '');
    payload.append('id', postId);

    selectedMedia.forEach((media, index) => {
      if (media.path && media.mime && media.mime.startsWith('image')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.jpg`,
        };
        payload.append('images', mediaFile);
      } else if (media.path && media.mime && media.mime.startsWith('video')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.mp4`,
        };
        payload.append('videos', mediaFile);
      } else if (media.name && media.uri) {
        const mediaFile = {
          uri: media.uri,
          type: media.type,
          name: `${media.name.replace(
            /\s+/g,
            '_',
          )}_${new Date().getTime()}.pdf`,
        };
        payload.append('files', mediaFile);
      } else if (media.imageUrl) {
        const mediaFile = {
          uri: media.imageUrl,
          type: 'image/jpeg',
          name: media.imageName.replace(/\s+/g, '_'),
        };
        payload.append('images', mediaFile);
      } else if (media.videoUrl) {
        const mediaFile = {
          uri: media.videoUrl,
          type: 'video/mp4',
          name: media.videoName.replace(/\s+/g, '_'),
        };
        payload.append('videos', mediaFile);
      } else if (media.fileUrl) {
        const mediaFile = {
          uri: media.fileUrl,
          type: 'application/octet-stream',
          name: media.fileUrl.replace(/\s+/g, '_'),
        };
        payload.append('files', mediaFile);
      }
    });

    return payload;
  };
  const generateEditNewsPayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineName', 'YourMachineName'); // Replace with actual machine name
    payload.append('machineIP', machineIP);
    payload.append('newsTitle', title);
    payload.append('newsDescripation', description ?? '');
    payload.append('newsId', postId);

    selectedMedia.forEach((media, index) => {
      if (media.path && media.mime && media.mime.startsWith('image')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.jpg`,
        };
        payload.append('images', mediaFile);
      } else if (media.path && media.mime && media.mime.startsWith('video')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.mp4`,
        };
        payload.append('videos', mediaFile);
      } else if (media.name && media.uri) {
        const mediaFile = {
          uri: media.uri,
          type: media.type,
          name: `${media.name.replace(
            /\s+/g,
            '_',
          )}_${new Date().getTime()}.pdf`,
        };
        payload.append('files', mediaFile);
      }
    });

    return payload;
  };
  const generateEventPayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineName', machineId); // Replace with actual machine name
    payload.append('machineIP', machineIP);
    payload.append('eventTitle', title);
    payload.append('eventDescripation', description ?? '');
    payload.append('createdDate', new Date().toISOString());
    selectedMedia.forEach((media, index) => {
      const mediaFile = {
        uri: media.path || media.uri,
        type: media.mime || media.type,
        name:
          media.path && media.mime && media.mime.startsWith('image')
            ? `${new Date().getTime()}_${index}.jpg`
            : media.path && media.mime && media.mime.startsWith('video')
            ? `${new Date().getTime()}_${index}.mp4`
            : `${media.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
      };
      payload.append(
        media.mime && media.mime.startsWith('image')
          ? 'images'
          : media.mime && media.mime.startsWith('video')
          ? 'videos'
          : 'files',
        mediaFile,
      );
    });

    return payload;
  };
  const generateEditEventPayload = async (): Promise<any> => {
    const payload = new FormData();
    const machineId = DeviceInfo.getDeviceId();
    const machineIP = await DeviceInfo.getIpAddress();

    payload.append('machineName', machineId); // Replace with actual machine name
    payload.append('machineIP', machineIP);
    payload.append('eventTitle', title);
    payload.append('eventDescripation', description ?? '');
    payload.append('eventId', postId);

    selectedMedia.forEach((media, index) => {
      if (media.path && media.mime && media.mime.startsWith('image')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.jpg`,
        };
        payload.append('images', mediaFile);
      } else if (media.path && media.mime && media.mime.startsWith('video')) {
        const mediaFile = {
          uri: media.path,
          type: media.mime,
          name: `${new Date().getTime()}_${index}.mp4`,
        };
        payload.append('videos', mediaFile);
      } else if (media.name && media.uri) {
        const mediaFile = {
          uri: media.uri,
          type: media.type,
          name: `${media.name.replace(
            /\s+/g,
            '_',
          )}_${new Date().getTime()}.pdf`,
        };
        payload.append('files', mediaFile);
      }
    });

    return payload;
  };

  const onCreate = async (): Promise<void> => {
    setLoading(true);
    let payload;

    if (mode === 'create') {
      if (screenTitle === 'News') {
        payload = await generateNewsPayload();
        await createNews(payload);
      } else if (screenTitle === 'Event') {
        payload = await generateEventPayload();
        await createEvent(payload);
      } else {
        payload = await generatePayload();
        await createNotice(payload);
      }
      // Fixme:Add logic to edit each post type 
    } else if (mode === 'edit') {
      if (screenTitle === 'News') {
        payload = await generateEditNewsPayload();
        // await editNews(payload);
      } else if (screenTitle === 'Events') {
        payload = await generateEditEventPayload();
        // await editEvent(payload);
      } else {
        payload = await generateEditPostPayload();
        await editPost(payload);
      }
    }

    setLoading(false);
  };

  return {
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
    editPostResult,
    mode,
    screenTitle,
    loading,
  };
};

export default useCreatePostScreen;
