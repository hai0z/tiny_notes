import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
const storage = new MMKV();

const zustandStorage: StateStorage = {
  getItem(name) {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem(name, value) {
    storage.set(name, value);
  },
  removeItem(name) {
    storage.delete(name);
  },
};

export default zustandStorage;
