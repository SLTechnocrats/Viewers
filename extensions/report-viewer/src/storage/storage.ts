import secureLocalStorage from 'react-secure-storage';

/**** purpose of admin login ******/
const setApiToken = (token: string) => {
  return secureLocalStorage.setItem('bearer', token);
};

const removeApiToken = () => {
  return secureLocalStorage.removeItem('bearer');
};
const getApiToken = (): string => {
  const token = secureLocalStorage.getItem('bearer');
  return String(token);
};

/**
 * set storage item
 * @param key
 * @param value
 */

const setStorageItem = (key: string, value: string) => {
  return secureLocalStorage.setItem(key, value);
};
/**
 * get storage item
 * @param key
 */

const getStorageItem = (key: string) => {
  return secureLocalStorage.getItem(key);
};

/**
 * remove storage item
 * @param key
 */

const removeStorageItem = (key: string) => {
  return secureLocalStorage.removeItem(key);
};

export {
  setApiToken,
  getApiToken,
  removeApiToken,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
};
