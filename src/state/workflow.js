import { useEffect, useState } from 'react';
import { callApi } from '../api';

export const useStepLibrary = () => {
  const [library, setLibrary] = useState();

  useEffect(() => {
    callApi('GET', '/api/workflow/step-library')
      .then((resp) => resp.json())
      .then(setLibrary);
  }, []);

  return library;
};
