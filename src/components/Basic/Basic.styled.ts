import styled from 'styled-components/native';

export type FontColor = 'regular' | 'subtle' | 'light' | 'primary';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'super' | 'max';

export const fontSizes: { [index in FontSize]: string } = {
  xs: '10px',
  s: '12px',
  m: '14px',
  l: '16px',
  xl: '18px',
  xxl: '24px',
  super: '32px',
  max: '54px',
};

export const lineHeights: { [index in FontSize]: string } = {
  xs: '12px',
  s: '13px',
  m: '21px',
  l: '24px',
  xl: '27px',
  xxl: '36px',
  super: '48px',
  max: '81px',
};

export type FontType = 'regular' | 'bold' | 'italic' | 'light' | 'medium';

const fontFamilies: { [index in FontType]: string } = {
  light: 'Rubik-Light',
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  bold: 'Rubik-ExtraBold',
  italic: 'Rubik-LightItalic',
};

export interface IStyledCustomText {
  size: FontSize;
  fontType: FontType;
  fontColor: FontColor;
}

export const StyledCustomText = styled.Text<IStyledCustomText>`
  color: ${(props) => props.theme.fontColors[props.fontColor]};
  font-size: ${(props) => fontSizes[props.size]};
  line-height: ${(props) => lineHeights[props.size]};
  font-family: ${(props) => fontFamilies[props.fontType]};
`;

export const StyledBaseScroll = styled.ScrollView`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const BasePage = styled.View`
  flex: 1;
  width: 100%;
`;

export const IconWrapper = styled.View`
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.primaryColor};
`;
