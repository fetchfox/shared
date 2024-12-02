import React, { useState, useEffect, useRef } from 'react';
import { MdEditSquare } from 'react-icons/md';

import { Check } from '../input/Check';
import { Input } from '../input/Input';
import { Button } from '../input/Button';

export const GlobalOptions = ({ workflow, onChange }) => {
  const [limit, setLimit] = useState('');
  const [shouldLimit, setShouldLimit] = useState(false);
  const [editing, setEditing] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const ref = useRef(null);

  useEffect(() => {
    const l = workflow?.options?.limit;
    setLimit(l);
    if (l) {
      setShouldLimit(true);
    }
  }, [workflow?.options?.limit]);

  const handleShouldLimit = async (val) => {
    setShouldLimit(val);
    setEditing(val);

    const copy = { ...workflow };
    if (!copy.options) {
      copy.options = {};
    }

    if (val) {
      copy.options.limit = '';
      setEditing(true);
    } else {
      copy.options.limit = null;
      setEditing(false);
      setLoading(true);
      await onChange(copy);
      setLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError();

    const num = Math.floor(parseInt(limit));
    if (isNaN(num)) {
      setError('Must be a number');
      return;
    }

    const copy = { ...workflow };
    if (!copy.options) {
      copy.options = {};
    }
    copy.options.limit = num;
    console.log('save', limit, copy);
    setLoading(true);
    await onChange(copy);
    setLoading(false);
    setEditing(false);
  };

  const edit = () => {
    setEditing(true);
    setTimeout(() => ref.current.select(), 10);
  };

  const editNode = (
    <div style={{ display: editing ? 'flex' : 'none', alignItems: 'center', gap: 10 }}>
      <Input
        value={limit}
        ref={ref}
        placeholder="Eg. 50"
        onChange={(e) => setLimit(e.target.value)}
        style={{ width: 100 }}
      />
      <Button small loading={loading}>
        Save
      </Button>
      {error}
    </div>
  );

  const valueNode = (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        background: 'rgba(0,0,0,0)',
        border: '1px solid #ddd',
        padding: '2px 8px',
        borderRadius: 4,
      }}
    >
      <div>
        <b>{limit}</b>
      </div>
      <Button simple gray trans onClick={edit}>
        <MdEditSquare size={18} />
      </Button>
    </div>
  );

  if (!workflow) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
      <Check value={shouldLimit} onChange={handleShouldLimit}>
        Limit number of results
      </Check>
      {shouldLimit && !editing && valueNode}
      <form onSubmit={save}>{editNode}</form>
      {/*
      <pre>{JSON.stringify(workflow.options, null, 2)}</pre>
      */}
    </div>
  );

  useEffect(() => {
    if (!workflow) return;
    if (shouldLimit !== undefined) return;

    console.log('clean global options got workflow:', JSON.stringify(workflow, null, 2));

    if (!workflow?.options || !workflow?.options?.limit) {
      setShouldLimit(false);
    } else {
      setShouldLimit(true);
    }
  }, [workflow?.options]);

  useEffect(() => {
    if (!workflow) return;
    if (!onChange) return;

    if (shouldLimit) {
      if (!workflow.options?.limit) {
        update('limit', 50);
      }
    } else {
      update('limit', undefined);
    }
  }, [shouldLimit, onChange]);

  const update = (field, val) => {
    return; //TODO

    console.log('global options update', field, val);
    console.log('global options update', onChange);
    const copy = { ...workflow };
    if (!copy.options) {
      copy.options = {};
    }

    if (field == 'limit' && !copy.options.limit) {
      copy.options.limit = 50;
    }

    copy.options[field] = val;
    onChange(copy);
  };

  if (!workflow) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
      <Check value={shouldLimit} onChange={setShouldLimit}>
        Limit number of results
      </Check>
      {shouldLimit && (
        <Input
          value={workflow.options?.limit || ''}
          placeholder="Eg. 50"
          onChange={(e) => update('limit', e.target.value)}
          style={{ width: 100 }}
        />
      )}
      {/*
      <pre>{JSON.stringify(workflow.options, null, 2)}</pre>
      */}
    </div>
  );
};
