import React from 'react';
import { useTheme } from 'styled-components';
import Animated, {
  interpolate,
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

const FACTOR_OVER = 0.8;
const FACTOR_ICON_GROWTH_BIG = 3.5;
const FACTOR_ICON_GROWTH_STD = 2;

const RESET_TIME_MS = 800;

const MID = { r: 127, g: 90, b: 240 };
const LEFT = { r: 238, g: 117, b: 113 };
const RIGHT = { r: 85, g: 138, b: 224 };

const Anim = Animated.createAnimatedComponent(SVG);
const AnimTouch = Animated.createAnimatedComponent(TouchableOpacity);

interface IMicIconProps extends SVGWrapperProps {
  onSend: () => void;
  onCancel: () => void;
  onStartTimer: () => void;
  onEndTimer: (n: number) => void;
}

const pad = (num: number): string => {
  return ('0' + num).slice(-2);
};

const mmss = (secs: number) => {
  let minutes = Math.floor(secs / 60);

  secs = secs % 60;
  minutes = minutes % 60;

  return pad(minutes) + ':' + pad(secs);
};

export const MicIcon = (props: IMicIconProps) => {
  const theme = useTheme();

  const animLock = useSharedValue(false);
  const gestureStartedRef = React.useRef<boolean>(false);
  const timerRef = React.useRef<null | number>(null);

  const [recordingTime, setRecordingTime] = React.useState(0);
  const recordingTimeStr = mmss(recordingTime);
  const [isRecording, setIsRecording] = React.useState(false);

  const [barWidth, setBarWidth] = React.useState<number>(0);

  const transformedProps = React.useMemo(
    () => transformSVGProps({ ...defaultSVGProps, ...props }),
    [props],
  );

  const positionRight =
    barWidth / 2 - transformedProps.width * (FACTOR_ICON_GROWTH_BIG / 2);
  const positionLeft = positionRight * -1;

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const outerStyle = useAnimatedStyle(() => {
    const val = interpolate(
      translation.x.value,
      [-100, 0, 100],
      [0, 0.8, 0],
      Animated.Extrapolate.CLAMP,
    );

    return {
      transform: [
        {
          translateX: translation.x.value,
        },
      ],
      backgroundColor: `rgba(243, 242, 252, ${val})`,
    };
  });

  const middleStyle = useAnimatedStyle(() => {
    const val = interpolate(
      translation.x.value,
      [-100, 0, 100],
      [0, 0.9, 0],
      Animated.Extrapolate.CLAMP,
    );

    return {
      backgroundColor: `rgba(234, 232, 252, ${val})`,
    };
  });

  const resetLock = () => {
    animLock.value = false;
  };

  const setLock = () => {
    animLock.value = true;
  };

  const toggleTo = (n: number) => {
    'worklet';

    if (animLock.value) {
      return;
    }

    runOnJS(setLock)();

    translation.x.value = withSpring(n, springConfig);

    translation.x.value = withDelay(
      RESET_TIME_MS,
      withSpring(0, springConfig, () => runOnJS(resetLock)()),
    );
  };

  const toggleCancel = () => {
    'worklet';
    toggleTo(positionLeft);
    runOnJS(setRecordingTime)(0);
    runOnJS(props.onCancel)();
  };

  const toggleSend = () => {
    'worklet';
    toggleTo(positionRight);
    runOnJS(setRecordingTime)(0);
    runOnJS(props.onSend)();
  };

  const innerStyle = useAnimatedStyle(() => {
    const range = positionRight;

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

    const width = interpolate(
      translation.x.value,
      [positionLeft, 0, positionRight],
      [
        transformedProps.width * FACTOR_ICON_GROWTH_BIG,
        transformedProps.width * FACTOR_ICON_GROWTH_STD,
        transformedProps.width * FACTOR_ICON_GROWTH_BIG,
      ],
    );

    return {
      width,
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    };
  });

  const startTimer = () => {
    props.onStartTimer();
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  };

  const endTimer = () => {
    props.onEndTimer(recordingTime);
    clearInterval(timerRef.current || 0);
  };

  const gestureStarted = () => {
    gestureStartedRef.current = true;
  };

  const gestureEnded = () => {
    gestureStartedRef.current = false;
  };

  React.useEffect(() => {
    return () => {
      endTimer();
    };
  }, []);

  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart: (_, ctx: any) => {
        runOnJS(gestureStarted)();

        if (animLock.value) {
          return;
        }

        ctx.startX = translation.x.value;
      },
      onActive: (event, ctx) => {
        if (animLock.value) {
          return;
        }

        let diff = ctx.startX + event.translationX;

        if (typeof diff != 'number') {
          return;
        }

        // prevent draw over border
        if (diff >= positionRight) {
          translation.x.value = positionRight;
          return;
        } else if (diff <= positionLeft) {
          translation.x.value = positionLeft;
          return;
        }

        translation.x.value = diff;
      },
      onEnd: (event, ctx) => {
        if (animLock.value) {
          return;
        }

        runOnJS(endTimer)();

        let diff = ctx.startX + event.translationX;

        if (diff >= positionRight * FACTOR_OVER) {
          toggleSend();
          return;
        } else if (diff <= positionLeft * FACTOR_OVER) {
          toggleCancel();
          return;
        }

        translation.x.value = withSpring(0, springConfig);
      },
      onFinish: () => {
        runOnJS(gestureEnded)();
      },
    },
    [barWidth],
  );

  return (
    <View style={[styles.center, styles.container]}>
      <View
        style={[
          styles.bar,
          styles.center,
          { height: transformedProps.height * 2, width: '100%' },
        ]}
        onLayout={({ nativeEvent }) => {
          setBarWidth(nativeEvent.layout.width);
        }}>
        <View style={[styles.inner]}>
          <AnimTouch style={[styles.center, styles.row]} onPress={toggleCancel}>
            <CancelIcon scale={0.6} />
            <Text style={[styles.text, { color: theme.cancel, marginLeft: 4 }]}>
              cancel
            </Text>
          </AnimTouch>

          <AnimTouch style={[styles.center, styles.row]} onPress={toggleSend}>
            <Text style={[styles.text, { color: theme.send, marginRight: 4 }]}>
              send
            </Text>
            <SendIcon scale={0.7} />
          </AnimTouch>
        </View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                zIndex: 1,
                position: 'absolute',
                borderRadius: transformedProps.width * 4,
                width: transformedProps.width * 4,
                height: transformedProps.height * 4,
              },
              styles.center,
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
                onPressIn={() => {
                  if (!animLock.value) {
                    startTimer();
                  }
                }}
                onPressOut={(e) => {
                  setTimeout(() => {
                    //HACK...
                    if (!gestureStartedRef.current) {
                      endTimer();
                    }
                  }, 200);
                }}
                style={[
                  {
                    position: 'absolute',
                    zIndex: 3,
                    borderRadius: transformedProps.width,
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
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={[styles.center, styles.row, { marginTop: 32 }]}>
        <View style={[styles.dot, { marginEnd: 4 }]} />
        <Text>{recordingTimeStr}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  bar: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 2,
    borderColor: '#ccc',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  container: {
    margin: 32,
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
  text: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
