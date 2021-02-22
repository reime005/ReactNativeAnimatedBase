import create from 'zustand';
import { save, saveString } from './storage/storage';

type State = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

export type ColorScheme = 'dark' | 'light';

export const useStore = create<State>((set, get) => {
  return {
    colorScheme: 'dark',
    setColorScheme: async (colorScheme) => {
      await saveString('COLOR_SCHEME', colorScheme);

      set(() => ({ colorScheme }));
    },
  };
});
