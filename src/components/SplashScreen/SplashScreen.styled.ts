import styled from 'styled-components/native';

export const StyledSplashScreen = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.primaryColor};
`;
