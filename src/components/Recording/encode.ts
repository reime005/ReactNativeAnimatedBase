const HEADER_LENGTH = 44;

export interface IAudioBuffer {
  sampleRate: number;
  numberOfChannels: number;
  length: number;
  data: number[];
}

export function encodeWav(audioBuffer: IAudioBuffer): Uint8Array {
  // based on https://github.com/cstoquer/audio-encoder/blob/master/src/encodeWav.js

  if (audioBuffer.sampleRate !== 44100) {
    throw new Error('Expecting 44100 Hz sample rate');
  }

  let nChannels = audioBuffer.numberOfChannels;

  if (nChannels !== 1 && nChannels !== 2) {
    throw new Error('Expecting mono or stereo audioBuffer');
  }

  let bufferLength = audioBuffer.length;

  // Creating the array buffers (2 bytes per samples * 1 channel)
  let arrayBuffer = new ArrayBuffer(
    HEADER_LENGTH + 2 * bufferLength * nChannels,
  );

  let int16 = new Int16Array(arrayBuffer);
  let uint8 = new Uint8Array(arrayBuffer);

  // WAV header
  // http://soundfile.sapp.org/doc/WaveFormat/
  // 52 49 46 46     R I F F
  // 24 08 00 00     chunk size
  // 57 41 56 45     W A V E

  // 66 6d 74 20     F T M █
  // 10 00 00 00     subchunk size
  // 01 00           audio format
  // 02 00           number of channels
  // 22 56 00 00     sample rate
  // 88 58 01 00     bitrate
  // 04 00           block align
  // 10 00           bit per sample
  // 64 61 74 61     d a t a
  // 00 08 00 00     subchunk2 size

  let l2 = bufferLength * nChannels * 2; // subchunk2 = numSamples * numChannels * BitsPerSample / 8
  let l1 = l2 + 36; // chunkSize = subchunk + 36
  let br = 44100 * nChannels * 2; // bitrate = SampleRate * NumChannels * BitsPerSample / 8

  uint8.set([
    // "RIFF" chunk descriptor
    0x52,
    0x49,
    0x46,
    0x46, // R I F F
    l1 & 255,
    (l1 >> 8) & 255,
    (l1 >> 16) & 255,
    (l1 >> 24) & 255, // chunk size
    0x57,
    0x41,
    0x56,
    0x45, // W A V E

    // "ftm" sub-chunk
    0x66,
    0x6d,
    0x74,
    0x20, // F T M █
    0x10,
    0x00,
    0x00,
    0x00, // sub chunk size = 16
    0x01,
    0x00, // audio format = 1 (PCM, linear quantization)
    nChannels,
    0x00, // number of channels
    0x44,
    0xac,
    0x00,
    0x00, // sample rate = 44100
    br & 255,
    (br >> 8) & 255,
    (br >> 16) & 255,
    (br >> 24) & 255, // byte rate
    0x04,
    0x00, // block align = 4
    0x10,
    0x00, // bit per sample = 16

    // data sub-chuk
    0x64,
    0x61,
    0x74,
    0x61, // d a t a
    l2 & 255,
    (l2 >> 8) & 255,
    (l2 >> 16) & 255,
    (l2 >> 24) & 255, // sub chunk 2 size
  ]);

  // Append sample data
  let buffers = audioBuffer.data;

  for (let i = 0, index = HEADER_LENGTH / 2; i < bufferLength; i++) {
    let sample = buffers[i];

    int16[index++] =
      sample < 0 ? Math.max(sample, -0x8000) : Math.min(sample, 0x7fff);
  }

  return uint8;
}

export function createHeader(audioBuffer: IAudioBuffer): number[] {
  const { length, numberOfChannels } = audioBuffer;

  let l2 = length * numberOfChannels * 2; // subchunk2 = numSamples * numChannels * BitsPerSample / 8
  let l1 = l2 + 36; // chunkSize = subchunk + 36
  let br = 44100 * numberOfChannels * 2; // bitrate = SampleRate * NumChannels * BitsPerSample / 8

  return [
    // "RIFF" chunk descriptor
    0x52,
    0x49,
    0x46,
    0x46, // R I F F
    l1 & 255,
    (l1 >> 8) & 255,
    (l1 >> 16) & 255,
    (l1 >> 24) & 255, // chunk size
    0x57,
    0x41,
    0x56,
    0x45, // W A V E

    // "ftm" sub-chunk
    0x66,
    0x6d,
    0x74,
    0x20, // F T M █
    0x10,
    0x00,
    0x00,
    0x00, // sub chunk size = 16
    0x01,
    0x00, // audio format = 1 (PCM, linear quantization)
    numberOfChannels,
    0x00, // number of channels
    0x44,
    0xac,
    0x00,
    0x00, // sample rate = 44100
    br & 255,
    (br >> 8) & 255,
    (br >> 16) & 255,
    (br >> 24) & 255, // byte rate
    0x04,
    0x00, // block align = 4
    0x10,
    0x00, // bit per sample = 16

    // data sub-chuk
    0x64,
    0x61,
    0x74,
    0x61, // d a t a
    l2 & 255,
    (l2 >> 8) & 255,
    (l2 >> 16) & 255,
    (l2 >> 24) & 255, // sub chunk 2 size
  ];
}
