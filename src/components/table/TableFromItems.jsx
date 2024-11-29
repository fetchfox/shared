import React, { useState, useEffect, useRef } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { Button } from '../input/Button';
import { Table } from './Table';

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

export const TableFromItems = ({
  items,
  headers,
  reverse,
  hover,
  noHeader,
  overflow,
  noOverflow,
  clipMiddle,
  style,
  allCellStyle,
  showPrivate,
}) =>
{

  const [mode, setMode] = useState('compact');
  if (!overflow) overflow = items.length + 10;
  const [hoverIndex, setHoverIndex] = useState();
  const [limit, setLimit] = useState(overflow);

  let extraStyles;
  let className;
  if (mode == 'compact') {
    extraStyles = {
      whiteSpacex: 'nowrap',
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

  headers = headers.filter(h => showPrivate || !h.startsWith('_'));

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
  let index = 0;
  let rows = (reverse ? items.reverse() : items).map(item => {
    const myIndex = index++;
    const style = {
      whiteSpace: 'nowrap',
    };
    return headers.map(h => <div onMouseOver={() => enter(item)} style={style}>{display(item[h])}</div>);
  });

  if (!noHeader) {
    rows.unshift(headers.map(h => <b>{h}</b>));
  }

  const overLimit = rows.length > limit;
  if (overLimit) {
    if (clipMiddle) {
      const top = Math.floor(overflow / 2);
      const bottom = Math.ceil(overflow / 2);

      const topRows = rows.slice(0, top);
      const bottomRows = rows.slice(rows.length - bottom, rows.length);

      const more = rows.length - top - bottom;

      rows = [
        ...topRows,
        [<div style={{}}>{more} more...</div>],
        ...bottomRows,
      ];
    } else {
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
            allCellStyle={{ maxWidth: 240, padding: '2px 4px', ...(allCellStyle || {}) }}
            style={{ width: '100%', ...style }}
            rows={rows} />
        </div>

        {overflowNode}

        {hover && hoverIndex !== undefined && 
         <Hover
         item={hoverIndex}
         onClose={() => setHoverIndex(null)}
         />}
    </div>
  );
}
