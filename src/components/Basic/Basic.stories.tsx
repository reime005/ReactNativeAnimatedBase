//@ts-check

import React from 'react';
import {
  text,
  select,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { AppText } from './Basic';
import { FontSize, FontType, FontColor } from './Basic.styled';

export const textWithSize = (size: FontSize) => {
  const content = text('text', 'You can change this text');

  const fontType: FontType = select<FontType>('Font Type', ['light', 'regular', 'medium', 'italic', 'bold'], 'regular', 'Options');
  const fontColor: FontColor = select<FontColor>('Font Color', ['light', 'primary', 'regular', 'subtle'], 'primary', 'Options');

  return <AppText size={size} fontColor={fontColor} fontType={fontType}>{content}</AppText>;
};

storiesOf('AppText', module)
  .add('Max Text', () => textWithSize('max'))
  .add('Super Text', () => textWithSize('super'))
  .add('XXL Text', () => textWithSize('xxl'))
  .add('XL Text', () => textWithSize('xl'))
  .add('L Text', () => textWithSize('l'))
  .add('M Text', () => textWithSize('m'))
  .add('S Text', () => textWithSize('s'))
  .add('XS Text', () => textWithSize('xs'));
