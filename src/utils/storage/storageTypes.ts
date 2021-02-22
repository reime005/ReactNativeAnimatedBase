enum StorageObject {
  TEST,
}

enum StorageStrings {
  COLOR_SCHEME,
}

export type STORAGE_OBJECT_KEYS = keyof typeof StorageObject;

export type STORAGE_STRING_KEYS = keyof typeof StorageStrings;
