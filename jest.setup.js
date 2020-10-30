import 'react-native-gesture-handler/jestSetup';

// import { BackHandler } from 'react-native'; // it's needed to direct access mocked version

// jest.mock('react-native', () => ({
//   BackHandler: {
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//   }
// }));


jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => { };

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');


// jest.mock('react-native', () => {
//   const RN = require('react-native');

//   return RN;
// });
