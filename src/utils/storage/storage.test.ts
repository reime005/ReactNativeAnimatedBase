import { AsyncStorage } from './async-storage';

import { load, loadString, save, saveString, clear, remove } from './storage';

// expo
jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    clear: jest.fn(),
  },
}));

// fixtures
const VALUE_OBJECT = {
  id: '1613571272163',
  duration: 2,
  base64Data: '',
  title: 'unnamed',
  filePath:
    '/private/var/mobile/Containers/Data/Application/6EF8AE9E-AC07-4326-884A-B320DBAB940A/tmp/1613571272163.wav',
};
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

beforeEach(() =>
  (AsyncStorage.getItem as jest.Mock).mockReturnValue(
    Promise.resolve(VALUE_STRING),
  ),
);
afterEach(() => jest.clearAllMocks());

test('load', async () => {
  const value = await load('TEST');
  expect(value).toEqual(JSON.parse(VALUE_STRING));
});

test('loadString', async () => {
  const value = await loadString('COLOR_SCHEME');
  expect(value).toEqual(VALUE_STRING);
});

test('save', async () => {
  await save('TEST', VALUE_OBJECT);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('TEST', VALUE_STRING);
});

test('saveString', async () => {
  await saveString('COLOR_SCHEME', VALUE_STRING);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    'COLOR_SCHEME',
    VALUE_STRING,
  );
});

test('remove', async () => {
  await remove('TEST');
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('TEST');
});

test('clear', async () => {
  await clear();
  expect(AsyncStorage.clear).toHaveBeenCalledWith();
});
