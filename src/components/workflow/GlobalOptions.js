import React, { useState, useEffect, useRef } from 'react';
import { Check } from '@/src/components/input/Check.js';
import { Input } from '@/src/components/input/Input.js';

export const GlobalOptions = ({ workflow, onChange }) => {
  const [useLimit, setUseLimit] = useState();

  useEffect(() => {
    if (!workflow) return;
    if (useLimit !== undefined) return;

    console.log('clean global options got workflow:', JSON.stringify(workflow, null, 2));

    if (!workflow?.options || !workflow?.options?.limit) {
      setUseLimit(false);
    } else {
      setUseLimit(true);
    }
  }, [workflow?.options]);

  useEffect(() => {
    if (!workflow) return;

    if (useLimit) {
      if (!workflow.options?.limit) {
        update('limit', 50);
      }
    } else {
      update('limit', undefined);
    }
  }, [useLimit]);

  const update = (field, val) => {
    const copy = { ...workflow };
    if (!copy.options) {
      copy.options = {};
    }

    if (field == 'limit' && !copy.options.limit) {
      copy.options.limit = 50;
    }

    copy.options[field] = val;
    onChange(copy);
  }

  if (!workflow) return null;

  return (
    <div style={{ display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 36 }}>
      <Check
        value={useLimit}
        onChange={setUseLimit}
        >
        Limit number of results
      </Check>
      {useLimit && <Input
        value={workflow.options?.limit}
        placeholder="Eg. 50"
        onChange={(e) => update('limit', e.target.value)}
        style={{ width: 100 }}
        />}
      {/*
      <pre>{JSON.stringify(workflow.options, null, 2)}</pre>
      */}
    </div>
  );
}
