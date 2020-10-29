import React from 'react';
import { useTheme } from 'styled-components';
import Animated from 'react-native-reanimated';

import _SVG from '../../assets/svg/settings.svg';

import { SVGWrapperProps, defaultSVGProps } from './SVGWrapper';

class SVG extends React.Component {
  render() {
    return <_SVG {...this.props} />;
  }
}

const Anim = Animated.createAnimatedComponent(SVG);

export const SettingsIcon = (props: SVGWrapperProps) => {
  const theme = useTheme();

  return (
    <Anim
      style={{}}
      {...{ ...defaultSVGProps, fill: theme.primaryColor, ...props }}
    />
  );
};
