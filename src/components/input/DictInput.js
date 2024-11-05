import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input.js';
import {
  FiPlus,
  FiMinus,
  FiMinusCircle,
} from 'react-icons/fi';
import {
  FaCircleMinus,
  FaCirclePlus,
} from 'react-icons/fa6';


const Pair = ({
  k,
  val,
  onRemove,
  onChangeVal,
  onChangeKey,
}) => {
  return (
    <div
      style={{ display: 'flex',
               width: '100%',
               gap: 5
             }}
      >
      <div>
        <Input
          style={{ width: '120px' }}
          value={k}
          onChange={(e) => onChangeKey(e.target.value)}
          placeholder="Field"
        />
      </div>
      <div style={{ width: '100%' }}>
        <Input
          style={{ width: '100%' }}
          value={val}
          onChange={(e) => onChangeVal(e.target.value)}
          placeholder="Describe the field"
        />
      </div>
      <div
        style={{ display: 'flex',
                 alignItems: 'center',
                 color: '#888',
                 cursor: 'pointer',
                 width: 20,
               }}
        onClick={onRemove}
        >
        <FaCircleMinus fontSize={18} />
      </div>
    </div>
  );
}

export const DictInput = (props) => {
  const [pairs, setPairs] = useState();

  useEffect(() => {
    if (pairs) return;
    if (!props.value) return;

    const pairs_ = [];
    if (Array.isArray(props.value)) {
      for (let v of props.value) {
        pairs_.push([v, v]);
      }
    } else {
      console.log('props', props);
      for (const key of Object.keys(props.value || {})) {
        pairs_.push([key, props.value[key]]);
      }
    }

    setPairs(pairs_);
  }, [props.value]);

  useEffect(() => {
    if (!pairs) return;
    const dict = {};
    for (const [key, val] of pairs) {
      dict[key] = val;
    }
    props.onChange && props.onChange(dict);
  }, [pairs]);

  const add = (key) => {
    const copy = [...pairs];
    copy.push(['', '']);
    setPairs(copy);
  }

  const remove = (key) => {
    const copy = [];
    for (const pair of pairs) {
      if (pair[0] != key) {
        copy.push(pair);
      }
    }
    setPairs(copy);
  }

  const updateKey = (key, key_) => {
    const copy = [...pairs];
    for (const pair of copy) {
      if (pair[0] == key) {
        pair[0] = key_;
        break;
      }
    }
    setPairs(copy);
  }

  const updateVal = (key, val_) => {
    const copy = [...pairs];
    for (const pair of copy) {
      if (pair[0] == key) {
        pair[1] = val_;
        break;
      }
    }
    setPairs(copy);
  }

  let i = 1;
  const nodes = (pairs || []).map(pair => (
    <Pair
      key={i++}
      k={pair[0]}
      val={pair[1]}
      onRemove={() => remove(pair[0])}
      onChangeKey={(key_) => updateKey(pair[0], key_)}
      onChangeVal={(val_) => updateVal(pair[0], val_)}
    />
  ));

  return (
    <div
      style={{ display: 'flex',
               flexDirection: 'column',
               gap: 5,
             }}
      >
      {nodes}
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

      {/*
      TODO2
      <pre>{JSON.stringify(pairs, null, 2)}</pre>
      TODO2
      <pre>{JSON.stringify(props, null, 2)}</pre>
      TODO2
      */}
    </div>
  );
}
