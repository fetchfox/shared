import { forwardRef } from 'react';

export const Input = forwardRef((props, ref) => {
  const { label, style, ...rest } = props;
  return (
    <div>
      {label && <div style={{ textAlign: 'left', fontSize: 14, fontWeight: 'bold', color: '#555' }}>{label}</div>}
      <input
        ref={ref}
        {...rest}
        style={{
          border: '1px solid #ccc',
          padding: '6px 10px',
          borderRadius: 6,
          boxShadow: '2px 2px #0001',
          fontSize: 14,
          ...style,
        }}
      />
    </div>
  );
});
