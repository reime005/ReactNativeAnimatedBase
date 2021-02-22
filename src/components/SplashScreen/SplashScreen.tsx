import React from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from 'styled-components';
import * as S from './SplashScreen.styled';

let { width } = Dimensions.get('screen');

// "maxWidth"
if (width > 800) {
  width = 800;
}

const SVG_WIDTH = 771;
const SVG_HEIGHT = 174;

const scaleFactor = (width * 0.8) / SVG_WIDTH;

const imageWidth = Math.ceil(SVG_WIDTH * scaleFactor);
const imageHeight = Math.ceil(SVG_HEIGHT * scaleFactor);

export const SplashScreen = () => {
  const theme = useTheme();

  return (
    <S.StyledSplashScreen>
    </S.StyledSplashScreen>
  );
};
