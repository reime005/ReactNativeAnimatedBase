import React from 'react';
import { View, Text } from 'react-native';
import { MicIcon } from '../SVG/MicIcon';

export const Recording = () => {
  const timerRef = React.useRef<null | number>(null);

  const [timerSeconds, setTimerSeconds] = React.useState(0);

  return (
    <View>
      <MicIcon scale={1.5} onStartTimer={() => {}} />
    </View>
  );
};
