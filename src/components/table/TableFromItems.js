import React, { useState, useEffect, useRef } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { Button } from '../input/Button.js';
import { Table } from './Table.js';

const tdStyle = {
  fontSize: 12,
  border: '1px solid #ccc',
  padding: 4,
  textAlign: 'left',
  tableLayout: 'fixed',
};

const Hover = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      style={{ position: 'sticky',
               background: 'white',
               border: '1px solid #ccc',
               marginTop: 5,
               padding: 5,
               bottom: 64, // TODO: don't hardcode hack this
               left: 0,
               zIndex: 200,
               width: '100%',
               whiteSpace: 'nowrap',
             }}
      >
      <div style={{ padding: 0 }}>
        <Table
          cellStyles={[{ width: 200 }]}
          style={{ width: '100%', fontSize: 12 }}
          rows={Object.keys(item).map(k => [
                <b>{k}</b>,
                item[k]
                ])}
        />

        {/*item*/}

      </div>
    </div>
  );
}

export const TableFromItems = ({ items, headers, reverse, hover }) => {
  const [mode, setMode] = useState('compact');
  const overflow = 10;
  const [hoverIndex, setHoverIndex] = useState();
  const [limit, setLimit] = useState(overflow);

  let extraStyles;
  let className;
  if (mode == 'compact') {
    extraStyles = {
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
    };
    className = '';
  } else {
    extraStyles = {};
    className = 'text-break';
  }

  if (!headers) {
    const seen = {};
    headers = [];
    for (const item of items) {
      for (const key of Object.keys(item)) {
        if (seen[key]) continue;
        seen[key] = true;
        if (key.match(/^Step[0-9]+_/)) {
          headers.unshift(key);
        } else {
          headers.push(key);
        }
      }
    }
  }

  const display = (val) => {
    if (typeof val == 'string') return val;
    return JSON.stringify(val);
  }

  const enter = (index) => {
    console.log('enter', index);
    setHoverIndex(index);
  }

  const leave = (index) => {
  }

  let id = 1;
  const headerNodes = headers.map(h => <th style={extraStyles}>{h}</th>);
  let index = 0;
  let rows = (reverse ? items.reverse() : items).map(item => {
    const myIndex = index++;
    const style = {
      whiteSpace: 'nowrap',
    };
    return headers.map(h => <div onMouseOver={() => enter(item)} style={style}>{display(item[h])}</div>);
  });

  rows.unshift(headers.map(h => <b>{h}</b>));

  const overLimit = rows.length > limit;
  if (overLimit) {
    const more = rows.length - limit;
    rows = rows.slice(0, limit);
    rows.push([
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setLimit(limit + more)}
        >
        Show {more} more...
      </div>
    ]);
  }

  const didOverflow = rows.length > overflow + 1;
  let overflowNode;
  if (didOverflow) {
    overflowNode = (
      <div
        className="dense"
        style={{ position: 'sticky',
                 bottom: 64,
                 zIndex: 100,
                 background: 'white',
                 borderTop: '1px solid #ccc',
                 padding: 5,
                 textAlign: 'center'
               }}>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setLimit(overflow)}
          >
          Show Less...
        </div>
      </div>
    );
  }

  return (
    <div onMouseLeave={() => setHoverIndex(null)}>
        <div style={{ overflowX: 'scroll' }}>
          <Table
            hoverCell
            allCellStyle={{ maxWidth: 240 }}
            style={{ width: '100%' }}
            rows={rows} />
        </div>

        {overflowNode}

        {hoverIndex !== undefined && 
         <Hover
         item={hoverIndex}
         onClose={() => setHoverIndex(null)}
         />
         }

    </div>
  );
}
