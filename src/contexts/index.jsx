import { useContext, createContext, useCallback, useState, useEffect } from 'react';
import { callApi, currentApiKey, endpoint } from '../api';
import { usePrevious } from '@uidotdev/usehooks';

// special fields:
//  - apiKey: if set, passed in header of api calls
export const GlobalContext = createContext(null);

export function GlobalContextProvider({ children }) {
  const [value, setValue] = useState({});
  const update = useCallback((data) => setValue((old) => ({ ...old, ...data })), []);

  const fullValue = {
    ...value,
    update,
    set: setValue,
  };

  // keep currentApiKey (global var) in sync with apiKey in global context
  // honestly, maybe we just don't put the api key in the context?
  useEffect(() => {
    currentApiKey.apiKey = value.apiKey;
    console.log('got api key', currentApiKey.apiKey);
  }, [value.apiKey]);

  return <GlobalContext.Provider value={fullValue}>{children}</GlobalContext.Provider>;
}

export const useGlobalContext = () => useContext(GlobalContext);

// takes a clerk token
//  - if null, user is logged out, clears user state
//  - if not null, uses that clerk token to call /api/user/me and get api key etc
export function useUserSync(clerkToken) {
  const { update } = useGlobalContext();

  const oldClerkToken = usePrevious(clerkToken);

  useEffect(() => {
    // we only care about changes to clerkToken
    if (oldClerkToken == clerkToken) return;

    if (!clerkToken) {
      update({ user: null, apiKey: null });
      return;
    }

    async function run() {
      console.log('user logged in, calling /user/me...', clerkToken);

      // we're calling /api/user/me, which expects a clerk token, NOT our api key.
      // hence we need to call fetch manually, and not use our callApi() function,
      // which injects *our* api key
      const resp = await fetch(endpoint('/api/user/me'), {
        headers: { Authorization: `Bearer ${clerkToken}` },
      });

      const data = await resp.json();
      console.log('/user/me', data);
      update({ user: data, apiKey: data?.apiKey });
    }

    run();
  }, [update, oldClerkToken, clerkToken]);
}
