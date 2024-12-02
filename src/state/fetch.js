import { useEffect, useState, useRef } from 'react';
import { callApi } from '../api';

export const useFetchCheck = (url) => {
  const [loading, setLoading] = useState();
  const [result, setResult] = useState();
  const ref = useRef(null);

  const params = { url };

  useEffect(() => {
    if (!url) return;

    try {
      new URL(url);
    } catch(e) {
      return;
    }

    if (ref.current) {
      clearTimeout(ref.current);
    }

    setLoading(true);
    ref.current = setTimeout(
      () => {
        const params = new URLSearchParams({ url, nocheck: 1, block: 1 }).toString();
        callApi('GET', '/api/internal/fetch-check?' + params)
          .then((resp) => resp.json())
          .then((data) => {
            console.log('fetch check result', data);
            setLoading(false);
            setResult(data);
          });
      },
      1000);
  }, [url]);

  return { result, loading };
};
