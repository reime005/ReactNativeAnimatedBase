module.exports = {
  root: true,
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  globals: { delay: false, jest: false },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
  },
};
