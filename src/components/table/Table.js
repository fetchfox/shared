import React, { useState, useEffect, useRef } from 'react';

export const Table = ({ rows, style, allCellStyle, cellStyles, hoverCell }) => {
  const [hlCell, setHlCell] = useState([-1, -1]);

  const tdStyle = {
    border: '1px solid #ccc',
    padding: '4px 6px',
    overflow: 'hidden',
    width: '100%',
  };

  const enter = (ri, ci) => {
    if (!hoverCell) return;
    setHlCell([ri, ci || -1]);
  }

  let ri = 0;
  const rowNodes = rows.map((row) => {
    if (!row) return null;

    let ci = 0;
    const myRi = ri++;
    const cellNodes = row.map((cell) => {
      const myCi = ci++;
      const hl = (hlCell[0] == myRi && (hlCell[1] == myCi || hlCell[1] == -1));
      const cellStyle = (cellStyles && cellStyles.length >= myCi) ? cellStyles[myCi] : {};

      return (
        <td
          style={{ ...tdStyle,
                   ...cellStyle,
                   ...(allCellStyle || {}),
                   ...(hl ? { background: '#f3f3f3'} : {})
                 }}
          key={''+myRi+':'+myCi}
          >
          {cell}
        </td>
      );
    });
    
    return (
      <tr
        onMouseEnter={() => enter(myRi, -1)}
        key={ri++}
        >
        {cellNodes}
      </tr>
    );
  });

  return (
    <div style={{ overflowX: 'scroll' }}>
      <table
        onMouseLeave={() => setHlCell([-1, -1])}
        style={{ borderCollapse: 'collapse', ...style }}
        >
        <tbody>
          {rowNodes}
        </tbody>
      </table>
    </div>
  );
}
