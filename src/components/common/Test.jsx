import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useGlobalContext } from '../../contexts/index.js';
import { Button } from '../input/Button';

export const Test = () => {
  const ctx = useGlobalContext();

  console.log('test ctx', ctx);

  useEffect(() => {
    console.log('test12');
  }, []);

  return (
    <div>
      Test from shared 7
      <Button>Test</Button>
    </div>
  );
}
