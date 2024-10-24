import React, { useState, useEffect, useRef, useMemo } from 'react';
import { endpoint } from "../utils.js";
export const useStepLibrary = () => {
  const [library, setLibrary] = useState();
  useMemo(() => {
    fetch(endpoint(`/api/workflow/step-library`)).then(resp => resp.json()).then(setLibrary);
  }, []);
  return library;
};
//# sourceMappingURL=workflow.js.map