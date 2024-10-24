import { useContext, createContext } from 'react';

export const GlobalContext = createContext(null);

export function useGlobalContext() {
  return useContext(GlobalContext);
}
