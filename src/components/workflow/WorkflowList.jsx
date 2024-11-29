import React, { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button } from '../input/Button';

export const WorkflowList = ({ workflows, limit, onOpen, onRemove }) => {
  const nodes = workflows
    .map(wf => (
      <div
        style={{ cursor: 'pointer',
                 borderTop: '1px solid #ccc',
                 padding: '5px',
                 display: 'flex',
                 alignItems: 'center',
                 gap: 8,
               }}
        onClick={() => onOpen(wf.id)}
        >
          <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {wf.name}
          </div>
          <div
            style={{ color: '#777',
                     whiteSpace: 'nowrap',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                   }}
            >
            {wf.description}
          </div>
        <Button
          small
          trans
          gray
          tooltip="Delete"
          onClick={(e) => { e.stopPropagation(); onRemove(wf.id) }}>
          <FaTrash />
        </Button>
      </div>
    ));

  if (nodes.length == 0) return null;

  return (
    <div>
      <div
        style={{ display: 'flex',
                 flexDirection: 'column',
                 marginTop: 10,
               }}
        >
        {limit ? nodes.slice(0, limit) : nodes}
      </div>
    </div>
  );
}
