import * as React from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import {
  BottomTabBarOptions,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { useTheme } from 'styled-components';
import { HomeIcon } from '../components/SVG/HomeIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SettingsIcon } from '../components/SVG/SettingsIcon';
import { BottomRoute, bottomRoutes } from './routes';

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name={bottomRoutes.home} component={HomeScreen} />
      <Tab.Screen name={bottomRoutes.settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const NavIcon = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const { focusedIconColor, unFocusedIconColor } = useTheme();

  const name = route.name as BottomRoute;

  const backgroundColor = isFocused ? focusedIconColor : unFocusedIconColor;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {name === 'home' && <HomeIcon fill={backgroundColor} />}
      {name === 'settings' && <SettingsIcon fill={backgroundColor} />}
    </TouchableOpacity>
  );
};

const screenOptions: BottomTabNavigationOptions = {
  tabBarIcon: NavIcon,
};

const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: 'tomato',
  inactiveTintColor: 'gray',
  showLabel: false
};
