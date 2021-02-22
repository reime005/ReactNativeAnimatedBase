import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import * as ReactNative from 'react-native';

import * as S from './Basic.styled';

interface IAppText
  extends Partial<S.IStyledCustomText & typeof ReactNative.Text> {
  children: string | string[];
}

export const AppText = (props: IAppText) => {
  return (
    <S.StyledCustomText
      {...{ fontColor: 'regular', fontType: 'regular', size: 'm', ...props }}
    />
  );
};

interface BaseScrollProps extends Partial<typeof ReactNative.ScrollView> {
  children: React.ReactNode | React.ReactNode[];
}

export const BaseScroll = (props: BaseScrollProps) => {
  return (
    <S.StyledBaseScroll
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={{ padding: 16 }}
      {...props}>
      {props.children}
    </S.StyledBaseScroll>
  );
};

export const BasePage = (props: any) => {
  const fadeAnim = React.useRef(new ReactNative.Animated.Value(0)).current;

  const fadeIn = () => {
    ReactNative.Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  const fadeOut = () => {
    ReactNative.Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200,
    }).start();
  };

  useFocusEffect(() => {
    fadeIn();
    return fadeOut;
  });

  return (
    <S.BasePage {...props} style={{ opacity: fadeAnim }}>
      {props.children}
    </S.BasePage>
  );
};
