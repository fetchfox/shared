import React from 'react';

export const Loading = ({ width, size, color, children }) => {
  color = color || '#333';
  width = size || width || 32;
  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{ display: 'flex',
                    alignItems: 'center',
                    gap: children ? width / 4 : 0,
                  }}>
          <svg width={width} height={width} viewBox={`0 0 24 24`} xmlns="http://www.w3.org/2000/svg"><style>{`.spinner_6kVp{transform-origin:center;animation:spinner_irSm .75s infinite linear;color: ${color};}@keyframes spinner_irSm{100%{transform:rotate(360deg)}}`}</style><path fill={color} d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z" className="spinner_6kVp"/></svg>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
      </div>
    </div>
  );
}
