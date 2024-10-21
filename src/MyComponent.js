import React from 'react';

export const MyComponent = () => {
  return React.createElement(
    'div', 
    { className: 'my-class' }, 
    'Hello, world!',
    React.createElement('p', null, 'This is a paragraph inside the div')
  );
};
