import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

export const Test = () => {

  useEffect(() => {
    console.log('test12');
  }, []);

  return (
    <div>
      Test from shared
    </div>
  );
}
