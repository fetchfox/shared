import React, { useState, useEffect } from 'react';
import Textarea_ from 'react-expanding-textarea';

export const Textarea = (props) => {
  return (
    <div>
      {props.label && <div style={{ textAlign: 'left', fontSize: 14, fontWeight: 'bold', color: '#555' }}>{props.label}</div>}
      <Textarea_
        {...props}
        style={{ border: '1px solid #ccc',
                 padding: '6px 10px',
                 borderRadius: 6,
                 boxShadow: '2px 2px #0001',
                 fontSize: 14,
                 ...props.style,
               }}
      />
    </div>
  );
}
