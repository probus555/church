import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScaledSize,
  TouchableOpacity,
  Text,
  AppState,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Video, {VideoProperties} from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace FontAwesome with your chosen icon library
import {useFocusEffect} from '@react-navigation/native'; // Assuming you use React Navigation
import FastImage from 'react-native-fast-image';

interface Props {
  source: VideoProperties['source'];
}

const VideoPlayer: React.FC<Props> = ({source}) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // Loading state
  const videoRef = useRef<Video>(null);
  let hideControlsTimeout: NodeJS.Timeout | null = null;

  // Update dimensions on orientation change
  const updateDimensions = ({window}: {window: ScaledSize}) => {
    setDimensions(window);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', updateDimensions);
  }, []);

  // Handle video pause when screen is unfocused (using React Navigation)
  useFocusEffect(
    React.useCallback(() => {
      setShowControls(true); // Show controls initially
      startHideControlsTimer(); // Start timer to hide controls after some time

      return () => {
        if (videoRef.current) {
          videoRef.current.seek(0); // Seek to beginning when component is unfocused
          setIsVideoPaused(true); // Pause the video when component is unfocused
        }
        clearHideControlsTimer(); // Clear timer when component unmounts
      };
    }, []),
  );

  const togglePlayPause = () => {
    setShowThumbnail(false); // Hide thumbnail when video starts playing
    setIsVideoPaused(!isVideoPaused);
    setShowControls(true); // Show controls when user interacts (toggles play/pause)
    startHideControlsTimer(); // Restart timer to hide controls
  };

  const handleScreenTouch = () => {
    if (videoRef.current) {
      setIsVideoPaused(!isVideoPaused); // Toggle video pause state
      setShowControls(true); // Show controls on any screen touch
      startHideControlsTimer(); // Restart timer to hide controls
      if (showThumbnail) {
        setShowThumbnail(false);
      }
    }
  };

  const startHideControlsTimer = () => {
    clearHideControlsTimer(); // Clear existing timer
    hideControlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 1000); // Hide controls after 3 seconds of inactivity
  };

  const clearHideControlsTimer = () => {
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = null;
    }
  };

  const handleOnLoad = () => {
    setIsLoading(false); // Set loading state to false when video is loaded
    if (isVideoPaused) {
      setShowThumbnail(true); // Show thumbnail if video is paused after loading
    }
  };

  const handleOnBuffer = ({isBuffering}: {isBuffering: boolean}) => {
    if (isBuffering) {
      setIsLoading(true); // Set loading state to true when video starts buffering
    } else {
      setIsLoading(false); // Set loading state to false when video stops buffering
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View
        style={[
          styles.container,
          {width: dimensions.width, height: dimensions.height},
        ]}>
        <Video
          ref={videoRef}
          playInBackground={false}
          playWhenInactive={false}
          controls={showControls}
          pictureInPicture
          collapsable
          paused={isVideoPaused}
          source={source}
          style={styles.video}
          resizeMode="contain"
          onLoad={handleOnLoad}
          onBuffer={handleOnBuffer}
        />
        {isLoading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        {showThumbnail && (
          <FastImage
            source={source}
            style={[
              styles.video,
              {justifyContent: 'center', alignItems: 'center'},
            ]} // Assuming the thumbnail should cover the video area
            resizeMode={FastImage.resizeMode.contain}
            children={<Icon name={'play'} size={40} color="#fff" />}
          />
        )}
        {showControls && !isLoading && (
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={togglePlayPause}>
            <Icon
              name={isVideoPaused ? 'play' : 'pause'}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Background color for the video player container
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20, // Adjust based on icon size
    marginLeft: -20, // Adjust based on icon size
  },
  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
