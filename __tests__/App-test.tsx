/**
 * @format
 */

import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Main } from '../src/components/Main/Main';
import { HomeScreen } from '../src/screens/HomeScreen';

it('renders correctly', async () => {
  renderer.create(<Main />);
});
