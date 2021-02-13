import React from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import { MicIcon } from '../SVG/MicIcon';
import Rec from 'react-native-recording';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import TrackPlayer from 'react-native-track-player';
import Share from 'react-native-share';
import { createHeader, encodeWav } from './encode';

const options = {
  bufferSize: 2048,
  sampleRate: 44100,
  bitsPerChannel: 16,
  channelsPerFrame: 1,
};

export const Recording = () => {
  const data = React.useRef<number[]>([]);
  const listenerRef = React.useRef<null | Rec>(null);

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
      <MicIcon
        scale={1.5}
        onStartTimer={async () => {
          Rec.init(options);

          listenerRef.current = Rec.addRecordingEventListener(
            (newData: number[]) => {
              data.current = [...data.current, ...newData];
            },
          );

          Rec.start();
        }}
        onEndTimer={(recordedSeconds: number) => {
          Rec.stop();
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

              await TrackPlayer.setupPlayer();

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
