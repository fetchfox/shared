import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaCheckCircle, FaDotCircle, FaTrash } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { Loading } from '../common/Loading';
import { Button } from '../input/Button';

const JobRow = ({ id, useJob, onOpen, onRemove }) => {
  const [job] = useJob(id);

  if (!job) return null;

  console.log('jobrow', job);

  const items = job.items || [];
  const ago = job.updatedAt ? formatDistanceToNow(new Date(job.updatedAt * 1000)) + ' ago' : '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        borderTop: '1px solid #ccc',
        padding: 5,
        whiteSpace: 'nowrap',
        height: 30,
      }}
      onClick={() => onOpen()}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!job.done && <Loading size={14} />}
        {job.done && !job.forcedDone && <FaCheckCircle color="green" />}
        {job.done && job.forcedDone && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaDotCircle
              size={16}
              color="#ffc107"
              data-tooltip-id={`forcedDone-${job.id}`}
              data-tooltip-content="Stopped before completion"
            />
            <Tooltip id={`forcedDone-${job.id}`} place="bottom-end" />
          </div>
        )}
      </div>
      <div style={{ fontWeight: 'bold', width: 160 }}>
        {items.length} {items.length == 1 ? 'item' : 'items'}
      </div>
      <div style={{ width: '100%', color: '#999' }}>{ago.upperFirst()}</div>
      <div style={{ fontFamily: 'monospace', color: '#999', fontSize: 10 }}>{job.id}</div>
      <Button
        small
        trans
        gray
        tooltip="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(job.id);
        }}
      >
        <FaTrash />
      </Button>
    </div>
  );
};

export const JobList = ({ useJob, jobIds, limit, onOpen, onRemove }) => {
  if (!jobIds) return null;

  const nodes = jobIds.map((id) => (
    <JobRow key={id} id={id} useJob={useJob} onOpen={() => onOpen(id)} onRemove={() => onRemove(id)} />
  ));

  return <div>{nodes.slice(0, limit || nodes.length)}</div>;
};
