import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';

import "../../config/i18n";
import { BottomNavigator } from '../../navigators/BottomNavigator';
import { lightTheme } from '../../config/theme';

export const Main = () => {
  return (
    <NavigationContainer>
      <ThemeProvider theme={lightTheme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <BottomNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};
