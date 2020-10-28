import * as React from 'react';
import { Text, View } from 'react-native';
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BottomTabBarOptions,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { useTheme } from 'styled-components';
import { HomeIcon } from '../components/SVG/HomeIcon';
import Animated, { sequence, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={HomeScreen} />
    </Tab.Navigator>
  );
};

const NavIcon = ({ state, descriptors, navigation }: any) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const { primaryColor, secondaryColor } = useTheme();

  const nav = useNavigation();

  const backgroundColor = isFocused ? primaryColor : secondaryColor;

  const scale = useSharedValue(2);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        scale.value = sequence(
          withTiming(3, { duration: 200 }),
          withTiming(2, { duration: 100 })
        );
      }}>
      <HomeIcon strokeWidth={scale.value} />
    </TouchableOpacity>
  );
};

const screenOptions: BottomTabNavigationOptions = {
  tabBarIcon: NavIcon,
};

const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: 'tomato',
  inactiveTintColor: 'gray',
};
