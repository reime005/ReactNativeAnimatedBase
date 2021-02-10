import React from 'react';
import { useTheme } from 'styled-components';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
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
  TouchableOpacity,
  View,
} from 'react-native';

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

const primaryColor = '127, 90, 240';

const MID = { r: 127, g: 90, b: 240 };
const LEFT = { r: 238, g: 117, b: 113 };
const RIGHT = { r: 85, g: 138, b: 224 };

const Anim = Animated.createAnimatedComponent(SVG);
const AnimTouch = Animated.createAnimatedComponent(TouchableOpacity);

export const MicIcon = (props: SVGWrapperProps) => {
  const theme = useTheme();

  const [barWidth, setBarWidth] = React.useState<number>(0);

  // TODO: memo
  const transformedProps = transformSVGProps({ ...defaultSVGProps, ...props });

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translation.x.value,
        },
      ],
    };
  });

  const outerStyle = useAnimatedStyle(() => {
    const val = interpolate(
      translation.x.value,
      [-100, 0, 100],
      [0, 0.05, 0],
      Animated.Extrapolate.CLAMP,
    );

    return {
      backgroundColor: `rgba(${primaryColor}, ${val})`,
    };
  });

  const middleStyle = useAnimatedStyle(() => {
    const val = interpolate(
      translation.x.value,
      [-100, 0, 100],
      [0, 0.1, 0],
      Animated.Extrapolate.CLAMP,
    );

    return {
      backgroundColor: `rgba(${primaryColor}, ${val})`,
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    const range = 150;

    const r = interpolate(
      translation.x.value,
      [-range, 0, range],
      [LEFT.r, MID.r, RIGHT.r],
      Animated.Extrapolate.CLAMP,
    );

    const g = interpolate(
      translation.x.value,
      [-range, 0, range],
      [LEFT.g, MID.g, RIGHT.g],
      Animated.Extrapolate.CLAMP,
    );

    const b = interpolate(
      translation.x.value,
      [-range, 0, range],
      [LEFT.b, MID.b, RIGHT.b],
      Animated.Extrapolate.CLAMP,
    );

    const a = 1;

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translation.x.value;
    },
    onActive: (event, ctx) => {
      translation.x.value = ctx.startX + event.translationX;
    },
    onEnd: (event, ctx) => {
      const diff = ctx.startX + event.translationX;

      if (diff > (barWidth * 0.5)) {
        translation.x.value = withSpring(barWidth / 2, springConfig);
        return;
      }

      translation.x.value = withSpring(0, springConfig);
    },
  }, [barWidth]);

  return (
    <View>
      <View
        style={[
          styles.bar,
          styles.center,
          { height: transformedProps.height * 2 },
        ]}
        onLayout={({ nativeEvent }) => {
          setBarWidth(nativeEvent.layout.width);
        }}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <AnimTouch
            style={[
              {
                borderRadius: transformedProps.width * 4,
                width: transformedProps.width * 4,
                height: transformedProps.height * 4,
              },
              styles.center,
              stylez,
              outerStyle,
            ]}>
            <AnimTouch
              style={[
                {
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: transformedProps.width * 3,
                  width: transformedProps.width * 3,
                  height: transformedProps.height * 3,
                },
                styles.center,
                middleStyle,
              ]}>
              <AnimTouch
                style={[
                  {
                    position: 'absolute',
                    zIndex: 3,
                    borderRadius: transformedProps.width,
                    width: transformedProps.width * 2,
                    height: transformedProps.height * 2,
                  },
                  styles.center,
                  innerStyle,
                ]}>
                <Anim
                  {...{
                    ...transformedProps,
                    color: '#fff',
                  }}
                />
              </AnimTouch>
            </AnimTouch>
          </AnimTouch>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 2,
    borderColor: '#ccc',
    margin: 24,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
