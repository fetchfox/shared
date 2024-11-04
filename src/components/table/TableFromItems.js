import React, { useState, useEffect, useRef } from 'react';
import './Table.css'

export const TableFromItems = ({ items, headers, reverse }) => {
  const [mode, setMode] = useState('compact');
  const overflow = 10;
  const [hoverId, setHoverId] = useState();
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

  const enter = (id) => {
    setHoverId(id);
  }

  const leave = (id) => {
    setHoverId(null);
  }

  const hover = (val) => {
    return (
      <div style={{ position: 'relative' }}>
        <div
          className="text-break"
          style={{ width: 200,
                   maxHeight: 300,
                   overflow: 'scroll',
                   position: 'absolute',
                   zIndex: 100,
                   topx: 0,
                   border: '1px solid #333',
                   background: 'white',
                 }}
          >
          {val}
        </div>
      </div>
    );
  }

  let id = 1;
  const headerNodes = headers.map(h => <th style={extraStyles}>{h}</th>);
  let rows = (reverse ? items.reverse() : items).map(item => {
    const nodes = headers.map(h => {
      const myId = id++;

      return (
        <td key={myId} className={className} style={{ maxWidth: 200 }}>
          <div
            style={{ cursor: 'default' }}
            onMouseEnter={() => enter(myId)}
            onMouseLeave={() => leave(myId)}
            >
            <div style={extraStyles}>{display(item[h])}</div>
            {(hoverId == myId) && hover(item[h])}
          </div>
        </td>
      )
    });

    return (
      <tr>
        {nodes}
      </tr>
    );
  });

  const overLimit = rows.length > limit;
  if (overLimit) {
    const more = rows.length - limit;
    rows = rows.slice(0, limit);
    rows.push(
      <tr>
        <td colSpan={headers.length}>
          <div
            className="clickable"
            onClick={() => setLimit(limit + more)}
          >
            Show {more} More...
          </div>
        </td>
      </tr>
    );
  }

  const didOverflow = rows.length > overflow + 1;
  let overflowNode;
  if (didOverflow) {
    overflowNode = (
      <div
        className="dense"
        style={{ position: 'sticky',
                 bottom: 0,
                 background: '#eee',
                 padding: 5,
                 textAlign: 'center'
               }}>
        <div
          className="clickable"
          onClick={() => setLimit(overflow)}
          >
          Show Less...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ ...extraStyles, overflowX: 'scroll' }}>
        <table className="dense">
          <thead>{headerNodes}</thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}
