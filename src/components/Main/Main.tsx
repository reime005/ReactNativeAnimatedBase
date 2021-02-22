import * as React from 'react';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';

import '../../config/i18n';
import { BottomNavigator } from '../../navigators/BottomNavigator';
import { darkTheme, lightTheme } from '../../config/theme';
import { ColorScheme, useStore } from '../../utils/useStorage';
import { loadString } from '../../utils/storage/storage';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { ThemedStatusBar } from '../ThemedStatusBar/ThemedStatusBar';
import { ErrorBoundary } from '../Error/ErrorBoundary';
import { SplashScreen } from '../SplashScreen/SplashScreen';

const LOADING_TIME_MS = 800;

export const Main = () => {
  const [loaded, setLoaded] = React.useState(false);

  const rnScheme = useColorScheme();

  const colorScheme = useStore((state) => state.colorScheme);
  const setColorScheme = useStore((state) => state.setColorScheme);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
    }, LOADING_TIME_MS);

    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    loadString('COLOR_SCHEME').then((loadedScheme) => {
      if (loadedScheme === 'dark' || loadedScheme === 'light') {
        setColorScheme(loadedScheme);
      } else {
        let newColorScheme: ColorScheme = 'dark';

        if (rnScheme === 'light') {
          newColorScheme = 'light';
        }

        setColorScheme(newColorScheme);
      }
    });
  }, [rnScheme, setColorScheme]);

  if (!loaded) {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={colorScheme === 'light' ? lightTheme : darkTheme}>
          <SplashScreen />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemedStatusBar barStyle="dark-content" />

      <NavigationContainer>
        <ThemeProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
          {/* get rid of 'white page flash' by passing initialMetrics */}
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <BottomNavigator />
          </SafeAreaProvider>
        </ThemeProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
};
