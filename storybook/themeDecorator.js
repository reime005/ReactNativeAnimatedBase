//@ts-check
import { select, button } from '@storybook/addon-knobs';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../src/config/theme';

export const themeDecorator = (story) => {
  const label = 'Theme';
  const options = {
    Dark: darkTheme,
    Light: lightTheme,
  };
  const defaultValue = lightTheme;
  const groupId = 'global';

  const theme = select(label, options, defaultValue, groupId);

  return <ThemeProvider theme={theme}>{story()}</ThemeProvider>;
};
