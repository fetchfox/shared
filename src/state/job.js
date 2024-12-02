import { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts';

export const useJob = (id) => {
  const { fox } = useGlobalContext();
  const [results, setResults] = useState();

  const cleanDone = (r) => {
    if (!r.done) return r;
    if (!Array.isArray(r.full)) return r;

    for (const step of r.full) {
      if (!step.done) {
        step.done = true;
        step.forcedDone = true;
        if (step.loading) {
          delete step.loading;
        }
      }
    }

    return r;
  };

  useEffect(() => {
    if (!id) return;
    if (!fox) return;

    setResults();
    fox
      .sub(id, (partial) => {
        console.log('FOX GOT PARTIAL', partial);
        setResults(cleanDone(partial));
      })
      .then((final) => {
        console.log('FOX GOT final', final);
        setResults(cleanDone(final));
      });
  }, [fox, id]);

  return results;
};
