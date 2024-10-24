import React, { useState, useEffect, useRef } from 'react';

export const Input = (props) => {
  return (
    <div>
      {props.label && <div style={{ textAlign: 'left', fontSize: 14, fontWeight: 'bold', color: '#555' }}>{props.label}</div>}
      <input
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
