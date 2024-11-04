import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowAltCircleDown,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,dit
} from 'react-icons/fa';
import { IoArrowUndo } from "react-icons/io5";
import {
  MdCancel,
  MdEditSquare,
  MdAddCircle,
  MdAddBox,
} from 'react-icons/md';
import { useGlobalContext }  from '@/src/contexts/index.js';
import { TableFromItems } from '@/src/components/table/TableFromItems';
import { Button } from '@/src/components/input/Button.js';
import { Input } from '@/src/components/input/Input.js';
import { ListInput } from '@/src/components/input/ListInput.js';
import { DictInput } from '@/src/components/input/DictInput.js';
import { Select } from '@/src/components/input/Select.js';
import { Textarea } from '@/src/components/input/Textarea.js';
import { Error } from '@/src/components/error/Error.js';
import { StepHeader } from './StepHeader.js';

export const GenericStepEdit = (props) => {
  const {
    step,
    index,
    workflowId,
    prettyName,
    onSubmit,
    onDone,
    onRemove,
  } = props;

  const innerComponent = props.innerComponent || GenericStepEditInner;

  const [step_, setStep_] = useState({});
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState();
  const ctx = useGlobalContext();

  const desc = (ctx?.library || {})[step?.name];

  useEffect(() => {
    if (!step) return;
    setStep_(JSON.parse(JSON.stringify(step)));
  }, [step]);

  const update = (key, value) => {
    const copy = { ...step_ };
    copy.args[key] = value;
    setStep_(copy);
  }

  const save = async () => {
    setLoading(true);
    setErrors(null);
    const data = await onSubmit(step_);
    if (data?.errors) {
      setErrors(data?.errors);
    } else {
      onDone();
    }
    setLoading(false);
  }

  const inner = innerComponent({
    ...props,
    step: step_,
    desc,
    errors,
    loading,
    onSave: save,
    onChange: update,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    save();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Hidden button to fix form not connected error */}
        <button style={{ display: 'none' }} type="submit">submit</button>
        {inner}
      </form>
    </div>
  )
}

const GenericStepEditInner = ({
  step,
  desc,
  loading,
  errors,
  index,
  workflowId,
  prettyName,
  onChange,
  onDone,
  onSave,
}) => {

  const keys = Object.keys(desc?.args || {});

  const stepArgs = step?.args || {};

  const rows = keys.map(key => {
    if (!desc) return null;

    // Handled globally, don't show it for individual steps
    if (key == 'limit') return null;

    const argDesc = desc.args[key];
    let inputNode;
    switch (argDesc.format) {
      case 'list':
        inputNode = (
          <ListInput
            style={{ width: '100%' }}
            value={stepArgs[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'object':
        inputNode = (
          <div>
            <DictInput
              style={{ width: '100%' }}
              value={stepArgs && stepArgs[key]}
              onChange={(val) => onChange(key, val)}
            />
          </div>
        );
        break;

      case 'choices':
        inputNode = (
          <Select
            style={{ width: '100%' }}
            choices={argDesc.choices.map(x => [x])}
            value={stepArgs[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'boolean':
        inputNode = (
          <Select
            style={{ width: '100%' }}
            choices={[[true, 'yes'], [false, 'no']]}
            value={stepArgs[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      default:
        inputNode = (
          <Input
            style={{ width: '100%' }}
            value={stepArgs[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        );
        break;
    }

    return (
      <tr>
        <th style={{ width: '100px', whiteSpace: 'nowrap' }}>
          {key.upperFirst()}
        </th>
        <td style={{ width: '100%', border: 0 }}>
          {inputNode}
          <Error small message={errors && errors[key]} />
        </td>
      </tr>
    );
  });

  return (
    <div>
      <StepHeader
        prettyName={prettyName}
        loading={loading}
        onDone={onDone}
        onSave={onSave}
      />
      <div>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>

      {/*
      <pre>desc:{JSON.stringify(desc, null, 2)}</pre>
      */}
    </div>
  );
}
