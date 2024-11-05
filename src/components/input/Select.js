import React, { useState, useEffect, useRef } from 'react';

export const Select = ({ style, label, choices, value, onChange }) => {

  if (!choices || choices.length == 0) return null;

  let nodes;
  if (choices[0].name) {
    nodes = [];
    for (const group of choices) {
      const node = group.choices.map((choice, index) => (
        <option key={index} value={choice[0]}>
          {choice.length == 1 ? choice[0] : choice[1]}
        </option>
      ));
      nodes.push(<optgroup label={group.name}>{node}</optgroup>);
    }
  } else {
    nodes = choices.map((choice, index) => (
      <option key={index} value={choice[0]}>
        {choice.length == 1 ? choice[0] : choice[1]}
      </option>
    ));
  }

  nodes.unshift(<option key="null" value=""></option>);

  const decode = (val) => {
    if (val == 'false') return false;
    if (val == 'true') return true;
    return val;
  }

  return (
    <div>
      {label && <div style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>{label}</div>}
      <select
        style={{ border: '1px solid #ccc',
                 padding: '6px',
                 borderRadius: 6,
                 boxShadow: '2px 2px #0001',
                 fontSize: 14,
                 ...style, 
               }}
        value={value}
        onChange={(e) => onChange(decode(e.target.value))}
        >
        {nodes}
      </select>
    </div>
  );
}
