import { useCallback, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export function useResponsiveCheck(mediaQuery) {
  const matches = useMediaQuery(mediaQuery);
  const ifMatch = useCallback((styles) => (matches ? styles : {}), [matches]);
  const [check, setCheck] = useState({
    ifMatch,
    matches,
  });

  useEffect(() => {
    setCheck({ matches, ifMatch });
  }, [ifMatch, matches]);

  return check;
}

export function useIfSmall() {
  return useResponsiveCheck('(max-width: 600px)');
}
