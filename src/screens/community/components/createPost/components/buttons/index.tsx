import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/core';
import {
  NavigationActionType,
  screenNames,
} from '../../../../../../navigation/rootNavigator/types';
import {useFocusEffect} from '@react-navigation/native';
const CreatePostButton = () => {
  const navigation = useNavigation<NavigationActionType>();
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  useFocusEffect(
    React.useCallback(() => {
      // Reset state when component gains focus
      isOpen.value = false;
      opacity.value = 0;
      firstValue.value = 30;
      secondValue.value = 30;
      thirdValue.value = 30;
      firstWidth.value = 60;
      secondWidth.value = 60;
      thirdWidth.value = 60;

      // Define cleanup function
      return () => {
        // Reset state when component loses focus
        isOpen.value = false;
        opacity.value = 0;
        firstValue.value = 30;
        secondValue.value = 30;
        thirdValue.value = 30;
        firstWidth.value = 60;
        secondWidth.value = 60;
        thirdWidth.value = 60;
      };
    }, []),
  );
  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, {duration: 100});
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withSpring(290);
      firstWidth.value = withDelay(1200, withSpring(200));
      secondWidth.value = withDelay(1100, withSpring(200));
      thirdWidth.value = withDelay(1000, withSpring(200));
      opacity.value = withDelay(1200, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    };
  });

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: firstValue.value,
      transform: [{scale: scale}],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: secondValue.value,
      transform: [{scale: scale}],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: thirdValue.value,
      transform: [{scale: scale}],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${progress.value * 45}deg`}],
    };
  });
  const handleActionButtonPress = (title: string) => {
    navigation.navigate(screenNames.createPost, {screenTitle:title,mode:'create',});
  };
  return (
    <View style={styles.container}>
   

      <AnimatedPressable
        onPress={() => handleActionButtonPress('Notice')}
        style={[styles.contentContainer, secondIcon, secondWidthStyle]}>
        <View style={styles.iconContainer}>
        <Feather name="bell" size={26} color="white" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Notice</Animated.Text>
      </AnimatedPressable>
   

      <AnimatedPressable
        onPress={() => handleActionButtonPress('Event')}
        style={[styles.contentContainer, firstIcon, firstWidthStyle]}>
        <View style={styles.iconContainer}>
          <Feather name="calendar" size={26} color="white" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Events</Animated.Text>
      </AnimatedPressable>

      <View style={styles.contentContainer}>
        <AnimatedPressable
          onPress={() => {
            handlePress();
          }}
          style={[styles.iconContainer, plusIcon]}>
          <Feather name="plus" size={26} color="white" />
        </AnimatedPressable>
      </View>
    </View>
  );
};

export default CreatePostButton;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  contentContainer: {
    backgroundColor: '#0F56B3',
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
   
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
