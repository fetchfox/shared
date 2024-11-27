import React, { useState, useEffect, useRef, forwardRef } from 'react';

export const Check = forwardRef((props, ref) => {
  const { value, onChange, label, style, children, ...rest } = props;
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 5 }}
      onClick={() => onChange(!value)}
      >
      <input
        type="checkbox"
        checked={value}
        ref={ref}
        readOnly
        style={{ ...style }}
      />
      {children}
    </div>
  );
});
