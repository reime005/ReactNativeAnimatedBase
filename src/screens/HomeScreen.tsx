import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, BaseScroll } from '../components/Basic/Basic';
import * as S from '../components/Basic/Basic.styled';
import { DragAndSnap } from '../components/DragAndSnap/DragAndSnap';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { name } = useRoute();

  return (
    <S.BasePage>
      <AppText>{t(`screen.${name}.title`)}</AppText>

      <BaseScroll>
        <DragAndSnap />
      </BaseScroll>
    </S.BasePage>
  );
};
