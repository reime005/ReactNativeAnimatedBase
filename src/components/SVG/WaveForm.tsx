import React from 'react';
import { useTheme } from 'styled-components';
import Animated, {
  interpolate,
  max,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import _SVG from '../../assets/svg/mic.svg';

import {
  SVGWrapperProps,
  defaultSVGProps,
  transformSVGProps,
} from './svgProps';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HomeIcon } from './HomeIcon';
import { CancelIcon } from './CancelIcon';
import { SendIcon } from './SendIcon';

class SVG extends React.Component {
  render() {
    return <_SVG {...this.props} />;
  }
}

const springConfig: Animated.WithSpringConfig = {
  damping: 50,
  velocity: 1000,
  stiffness: 1000,
};

interface IWaveFormProps {
  barHeights: Animated.SharedValue<number>[];
  isRecording: boolean;
}

export const WaveForm = (props: IWaveFormProps) => {
  const { barHeights, isRecording } = props;
  const [containerWidth, setContainerWidth] = React.useState(0);

  const barWidth = containerWidth / barHeights.length - 16; // (minus margin)

  return (
    <View
      style={[styles.center, styles.container, styles.row]}
      onLayout={({ nativeEvent }) => {
        setContainerWidth(nativeEvent.layout.width);
      }}>
      {isRecording &&
        barHeights.map((sharedValue, index) => {
          return (
            <Bar
              key={`bar-${index}`}
              height={sharedValue}
              width={barWidth}
              currentIndex={index}
              maxIndex={barHeights.length}
            />
          );
        })}
    </View>
  );
};

interface IBarProps {
  height: Animated.SharedValue<number>;
  width: number;
  currentIndex: number;
  maxIndex: number;
}

const Bar = (props: IBarProps) => {
  const { width, height, currentIndex, maxIndex } = props;

  const { primaryColor: backgroundColor } = useTheme();

  const outerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      currentIndex,
      [0, maxIndex / 2, maxIndex],
      [0.4, 0.95, 0.4],
    );

    return {
      height: height.value,//withSpring(height.value, springConfig),
      opacity,
    };
  });

  return (
    <Animated.View
      style={[outerStyle, styles.bar, { width, backgroundColor }]}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    borderRadius: 50,
    maxHeight: 100,
  },
  container: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});
