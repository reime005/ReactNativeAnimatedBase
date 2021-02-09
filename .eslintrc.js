module.exports = {
  root: true,
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'reanimated'],
  globals: { delay: false, jest: false },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'reanimated/js-function-in-worklet': 2,
  },
};
