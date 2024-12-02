import { createContext, useCallback, useContext, useState } from 'react';
import { currentApiKey } from '../api';

// special fields:
//  - apiKey: if set, passed in header of api calls
export const GlobalContext = createContext(null);

export function GlobalContextProvider({ children }) {
  const [value, _setValue] = useState({});

  const setValue = useCallback((setter) => {
    if (typeof setter === 'function') {
      _setValue((old) => {
        const newValue = setter(old);
        currentApiKey.apiKey = newValue.apiKey;
        return newValue;
      });
    } else {
      currentApiKey.apiKey = setter.apiKey;
      _setValue(setter);
    }
  }, []);

  const update = useCallback((data) => setValue((old) => ({ ...old, ...data })), [setValue]);

  const fullValue = {
    ...value,
    update,
    set: setValue,
  };

  return <GlobalContext.Provider value={fullValue}>{children}</GlobalContext.Provider>;
}

export const useGlobalContext = () => useContext(GlobalContext);
