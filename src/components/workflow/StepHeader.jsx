import React, { useState, useEffect, useRef } from 'react';
import { MdCancel, MdEditSquare, MdAddCircle, MdAddBox } from 'react-icons/md';
import { Button } from '../input/Button';

export const StepHeader = ({ prettyName, loading, onEdit, onDone, onSave, onRemove }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 14,
        height: 24,
        fontWeight: 'bold',
        marginBottom: 5,
      }}
    >
      <div>{prettyName}</div>
      <div className="controls" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {onDone && (
          <Button trans small onClick={onDone}>
            Cancel
          </Button>
        )}
        {onRemove && (
          <Button simple gray trans onClick={onRemove} tooltip="Remove">
            <MdCancel size={18} />
          </Button>
        )}
        {onSave && (
          <Button small loading={loading} type="submit">
            Save
          </Button>
        )}
        {onEdit && (
          <Button simple gray trans onClick={onEdit} tooltip="Edit">
            <MdEditSquare size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};
