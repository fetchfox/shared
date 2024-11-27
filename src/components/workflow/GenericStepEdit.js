import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowAltCircleDown,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,dit
} from 'react-icons/fa';
import { IoArrowUndo } from "react-icons/io5";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import {
  MdCancel,
  MdEditSquare,
  MdAddCircle,
  MdAddBox,
} from 'react-icons/md';
import { useGlobalContext }  from '../../contexts/index.js';
import { TableFromItems } from '../table/TableFromItems';
import { Button } from '../input/Button.js';
import { Input } from '../input/Input.js';
import { ListInput } from '../input/ListInput.js';
import { DictInput } from '../input/DictInput.js';
import { Select } from '../input/Select.js';
import { Textarea } from '../input/Textarea.js';
import { Error } from '../error/Error.js';
import { StepHeader } from './StepHeader.js';
import { camelToHuman } from '../../utils.js';
import { fieldsMeta } from './Workflow.js';

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
      await onDone();
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

  const [showAdvanced, setShowAdvanced] = useState();

  const meta = fieldsMeta[desc.name];
  const keys = Object.keys(desc?.args || {});
  const stepArgs = step?.args || {};

  const renderField = (key) => {
    if (!desc) return null;

    // Handled globally, don't show it for individual steps
    if (key == 'limit') return null;

    let isPrimary = meta?.primary == key;

    const argDesc = desc.args[key];
    let inputNode;
    switch (argDesc.format) {
      case 'list':
      case 'array':
        inputNode = (
          <ListInput
            key={key}
            style={{ width: '100%' }}
            value={stepArgs[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'object':
        inputNode = (
          <DictInput
            key={key}              
            style={{ width: '100%' }}
            value={stepArgs && stepArgs[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'choices':
        inputNode = (
          <Select
            key={key}              
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
            key={key}              
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
            key={key}              
            style={{ width: '100%' }}
            value={stepArgs[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        );
        break;
    }

    return (
      <tr>
        <th style={{ width: 120, whiteSpace: 'nowrap', fontSize: 14 }}>
          {camelToHuman(key.upperFirst())}
        </th>
        <td
          style={{
                 width: '100%',
                 border: '1px solid #ccc',
                 }}
          >
          {inputNode}
          {/*JSON.stringify(desc.args[key])*/}
          <div style={{ whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
            {desc?.args && desc.args[key] && desc.args[key].description}
          </div>
          <Error small message={errors && errors[key]} />
        </td>
      </tr>
    );
  }

  let basicKeys;
  let advancedKeys;
  if (meta?.basic) {
    basicKeys = keys.filter(key => meta.basic[key]);
    advancedKeys = keys.filter(key => !meta.basic[key]);
  } else {
    basicKeys = keys;
    advancedKeys = [];
  }
  const basicRows = basicKeys.map(renderField);
  const advancedRows = advancedKeys.map(renderField).filter(Boolean);

  return (
    <div>
      <StepHeader
        prettyName={prettyName}
        loading={loading}
        onDone={onDone}
        onSave={onSave}
      />

      <div>
        <table style={{ tableLayout: 'fixed' }}>
          <tbody>{basicRows}</tbody>
        </table>
      </div>

      {advancedRows.length > 0 && <div style={{ marginTop: 10 }}>
        <div
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          >
          {!showAdvanced && <IoMdArrowDropright size={16} />}
          {showAdvanced && <IoMdArrowDropdown size={16} />}
          <div>
            Advanced
          </div>
        </div>
        <div style={{ display: (showAdvanced ? 'block' : 'none') }}>
          <table style={{ tableLayout: 'fixed' }}>
            <tbody>{advancedRows}</tbody>
          </table>
        </div>
      </div>}

      {/*
      <pre>desc:{JSON.stringify(desc, null, 2)}</pre>
      */}
    </div>
  );
}
