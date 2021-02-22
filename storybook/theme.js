import { ThemeProvider } from 'styled-components';
import { addDecorator } from '@storybook/react-native';
import { withThemes } from '@react-theming/storybook-addon';
import { darkTheme, lightTheme } from '../src/config/theme';

addDecorator(withThemes(ThemeProvider, [{}, darkTheme, lightTheme]));
