import 'styled-components';
import { FontColor } from '../components/Basic/Basic.styled';

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    secondaryColor: string;
    searchBackgroundColor: string;
    focusedIconColor: string;
    unFocusedIconColor: string;
    fontColors: { [index in FontColor]: string };
  }
}
