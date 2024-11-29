import { useEffect, useState } from 'react';
import { endpoint } from '../utils.js';

export const useStepLibrary = () => {
  const [library, setLibrary] = useState();

  useEffect(() => {
    fetch(endpoint(`/api/workflow/step-library`))
      .then((resp) => resp.json())
      .then(setLibrary);
  }, []);


  return library;
}
