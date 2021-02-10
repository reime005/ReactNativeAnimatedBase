import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from '../components/Basic/Basic.styled';
import { DragAndSnap } from '../components/DragAndSnap/DragAndSnap';
import { Recording } from '../components/Recording/Recording';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { name } = useRoute();

  return (
    <S.BasePage>
      <S.BaseText>{t(`screen.${name}.title`)}</S.BaseText>

      <S.BaseScroll contentContainerStyle={{ flex: 1 }}>
        <Recording />
      </S.BaseScroll>
    </S.BasePage>
  );
};
