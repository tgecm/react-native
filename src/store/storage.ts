import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

export const initStorage = () => {
  if (!storage) {
    storage = new MMKV({
      id: 'teleshop-admin-storage',
    });
  }
  return storage;
};

export const getStorage = (): MMKV => {
  if (!storage) {
    return initStorage();
  }
  return storage;
};
