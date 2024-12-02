import React, { useState, useEffect, useRef } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const CompactContentNode = ({ title, onOpen, children }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        position: 'absolute',
        zIndex: 10,
        top: 30,
        left: 0,
        background: 'white',
        borderRadius: 4,
        padding: '15px',
        boxShadow: `3px 4px 6px rgba(0,0,0,.1)`,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{ cursor: 'pointer', color: '#555', position: 'absolute', top: 0, right: 0 }}
          onClick={() => onOpen(false)}
        >
          <FaTimesCircle size={18} />
        </div>
        {children}
      </div>
    </div>
  );
};

const ContentNode = ({ title, onOpen, children }) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255,255,255,0.8)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => onOpen(false)}
    >
      <div
        style={{
          border: '1px solid #ccc',
          margin: 10,
          padding: 10,
          background: 'white',
          borderRadius: 8,
          position: 'relative',
          maxHeight: '80vh',
          overflow: 'scroll',
        }}
        onWheel={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, color: '#555' }}>{title}</div>
          <div style={{ cursor: 'pointer', color: '#555' }} onClick={() => onOpen(false)}>
            <FaTimesCircle size={18} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Modal = ({ children, title, compact }) => {
  const [open, setOpen] = useState();

  const openNode = (
    <div style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
      {children[0]}
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      {openNode}

      {open && compact && (
        <CompactContentNode title={title} onOpen={setOpen}>
          {children[1]}
        </CompactContentNode>
      )}
      {open && !compact && (
        <ContentNode title={title} onOpen={setOpen}>
          {children[1]}
        </ContentNode>
      )}
    </div>
  );
};
