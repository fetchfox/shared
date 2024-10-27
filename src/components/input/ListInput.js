import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/src/components/input/Input';
import {
  FiPlus,
  FiMinus,
  FiMinusCircle,
} from 'react-icons/fi';
import {
  FaCircleMinus,
  FaCirclePlus,
} from 'react-icons/fa6';


export const ListInput = (props) => {

  const update = (index, e) => {
    const copy = [...props.value];
    copy[index] = e.target.value;
    props.onChange(copy);
  }

  const remove = (index) => {
    const copy = [...props.value];
    copy.splice(index, 1);
    props.onChange(copy);
  }

  const add = () => {
    const copy = [...props.value];
    copy.push('');
    props.onChange(copy);
  }

  let i = 0;
  const nodes = props.value.map(v => {
    const index = i++;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: '100%' }}>
          <Input
            style={{ width: '100%' }}
            key={index}
            value={props.value[index]}
            onChange={(e) => update(index, e)}
          />
        </div>
        <div
          style={{ display: 'flex',
                   alignItems: 'center',
                   color: '#888',
                   cursor: 'pointer',
                 }}
          onClick={() => remove(index)}
          >
          <FaCircleMinus fontSize={18} />
        </div>
      </div>
    );
  });

  return (
    <div>
      {props.label && <div style={{ fontSize: 14, fontWeight: 'bold', color: '#555' }}>{props.label}</div>}
      <div style={{ display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    width: '100%',
                  }}>
        {nodes}
      </div>
      <div
        style={{ display: 'flex',
                 margin: '6px 0 2px 0',
                 color: '#888',
                 cursor: 'pointer' }}
        onClick={add}
        >
        <div style={{ marginRight : 5, display: 'flex', alignItems: 'center' }}><FaCirclePlus fontSize={18} /></div>
        <div style={{ fontWeight: 'bold' }}>Add Field</div>
      </div>
    </div>
  );
}
