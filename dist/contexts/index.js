import { useContext, createContext } from 'react';
export const GlobalContext = /*#__PURE__*/createContext(null);
export function useGlobalContext() {
  return useContext(GlobalContext);
}
//# sourceMappingURL=index.js.map