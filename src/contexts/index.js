import { useContext, createContext } from 'react';

export const GlobalContext = createContext(null);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export const GlobalContextX = createContext(null);
export function useGlobalContextX() {
  return useContext(GlobalContextX);
}
