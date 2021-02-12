import React from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import { MicIcon } from '../SVG/MicIcon';

export const Recording = () => {
  const timerRef = React.useRef<null | number>(null);

  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [recData, setRecData] = React.useState(0);

  React.useEffect(() => {
    const init = () => {};

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ])
        .then(init)
        .catch(() => {
          /* UNHANDLED */
        });
    } else {
      init();
    }
  }, []);

  return (
    <View>
      <MicIcon
        scale={1.5}
        onStartTimer={async () => {}}
        onEndTimer={(recordedSeconds: number) => {
          console.warn({ recordedSeconds });
        }}
      />

      <Text>{JSON.stringify(recData)}</Text>
    </View>
  );
};
