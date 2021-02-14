import React from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import { MicIcon } from '../SVG/MicIcon';
import Rec from 'react-native-recording';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import TrackPlayer from 'react-native-track-player';
import Share from 'react-native-share';
import { createHeader, encodeWav } from './encode';
import { WaveForm } from '../SVG/WaveForm';
import { useSharedValue } from 'react-native-reanimated';

const options = {
  bufferSize: 4096,
  sampleRate: 44100,
  bitsPerChannel: 16,
  channelsPerFrame: 1,
};

export const Recording = () => {
  const barHeights = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const data = React.useRef<number[]>([]);
  const listenerRef = React.useRef<null | Rec>(null);

  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [recData, setRecData] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      // await TrackPlayer.setupPlayer();
    };

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

    return () => {
      TrackPlayer.stop();
      listenerRef.current?.remove();
    };
  }, []);

  const reset = () => {
    data.current = [];
  };

  return (
    <View>
      <WaveForm barHeights={barHeights} isRecording={isRecording} />

      <MicIcon
        scale={1.5}
        onStartTimer={async () => {
          Rec.init(options);

          let throttleTimer = 0;

          listenerRef.current = Rec.addRecordingEventListener(
            (newData: number[]) => {
              data.current = [...data.current, ...newData];

              const barFactor = newData.length / barHeights.length;

              if (Date.now() - throttleTimer < 25) {
                return;
              }

              throttleTimer = Date.now();

              barHeights.forEach((bar, index) => {
                let value = newData[Math.ceil(index * barFactor)];
                value = (0.5 + Math.abs(value) / 8192) * 100;
                bar.value = value;
              });
            },
          );

          setIsRecording(true);
          Rec.start();
        }}
        onEndTimer={(recordedSeconds: number) => {
          Rec.stop();

          if (listenerRef.current) {
            listenerRef.current.remove();
            listenerRef.current = null;
          }

          setIsRecording(false);
        }}
        onSend={() => {
          const path = RNFS.TemporaryDirectoryPath + 'test.wav';

          const encodedData = encodeWav({
            data: data.current,
            length: data.current.length,
            numberOfChannels: options.channelsPerFrame,
            sampleRate: options.sampleRate,
          });

          reset();

          const base64Data = Buffer.from(encodedData).toString('base64');

          // write the file
          RNFS.writeFile(path, base64Data, 'base64')
            .then(async (success) => {
              // Share.open({ url: path })
              //   .then((res) => {
              //     console.log(res);
              //   })
              //   .catch((err) => {
              //     err && console.log(err);
              //   });

              await TrackPlayer.add({
                id: 'trackId',
                url: `file://${path}`,
                title: 'Track Title',
                artist: 'Track Artist',
              });

              // Start playing it
              await TrackPlayer.play();
            })
            .catch((err) => {
              console.warn(err.message);
            });
        }}
        onCancel={() => {
          reset();
        }}
      />
    </View>
  );
};
