import React, { useState, useEffect, useRef } from 'react';
import { FaStop } from 'react-icons/fa';
import { useGlobalContext } from '../../contexts/index.js';
import { useJob } from '../../state/job.js';
import { Button } from '../input/Button.js';
import { foxHost } from '../../constants.js';

export const StopButton = ({ jobId, onStop, ...rest }) => {
  const { fox } = useGlobalContext();

  const stop = async () => {
    fox.stop(jobId);
    onStop && onStop();
  }

  return (
    <Button {...rest} onClick={stop}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', top: 2 }}><FaStop size={16} /></div>
        <div>Stop</div>
      </div>
    </Button>
  );
}
