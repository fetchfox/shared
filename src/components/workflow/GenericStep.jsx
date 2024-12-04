import { useEffect, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import { useGlobalContext } from '../../contexts';
import { capitalize } from '../../utils';
import { Error } from '../error/Error';
import { DictInput } from '../input/DictInput';
import { Input } from '../input/Input';
import { ListInput } from '../input/ListInput';
import { Select } from '../input/Select';
import { StepHeader } from './StepHeader';
import { fieldsMeta } from './Workflow';

export const GenericStep = ({ step, prettyName, editable, onEdit, onRemove }) => {
  const { library } = useGlobalContext();
  const desc = library ? library[step?.name] : {};
  const keys = Object.keys(step?.args);

  if (!desc?.args) return null;

  const render = (key) => {
    if (!desc) return null;

    const argDesc = desc.args[key];
    const arg = step.args[key];

    if (!arg) return null;

    console.log('render generic step', key, argDesc, step, library);

    if (!argDesc) {
      return (
        <div>
          {key}={JSON.stringify(arg)}
        </div>
      );
    }

    switch (argDesc.format) {
      case 'list':
      case 'array':
        return (
          <ul>
            {arg.map((x) => (
              <li>{x}</li>
            ))}
          </ul>
        );

      case 'object':
        return (
          <Table
            cellStyles={[{ width: '10%' }]}
            rows={Object.keys(arg).map((k) => [<b>{k}</b>, '' + arg[k]])}
          />
        );

      case 'boolean':
        return arg ? 'yes' : 'no';

      case 'number':
      case 'string':
      case 'choices':
        return arg;

      default:
        return (
          <div>
            {argDesc.format} {JSON.stringify(arg)}
          </div>
        );
    }
  };

  const rows = keys.map((key) => {
    const display = render(key);
    if (!display) return null;
    return [<b style={{ whiteSpace: 'nowrap', width: 100, display: 'inline-block' }}>{camelToHuman(key)}</b>, display];
  });

  return (
    <div>
      <StepHeader prettyName={prettyName} onEdit={editable && onEdit} onRemove={editable && onRemove} />

      <div style={{ background: '#fff' }}>
        <Table style={{ width: '100%' }} cellStyles={[{ width: '10%' }]} rows={rows} />
      </div>
    </div>
  );
};

export const GenericStepEdit = (props) => {
  const { step, index, workflowId, prettyName, onSubmit, onDone, onRemove } = props;

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
  };

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
  };

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
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Hidden button to fix form not connected error */}
        <button style={{ display: 'none' }} type="submit">
          submit
        </button>
        {inner}
      </form>
    </div>
  );
};

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
          <ListInput key={key} style={{ width: '100%' }} value={stepArgs[key]} onChange={(val) => onChange(key, val)} />
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
            choices={argDesc.choices.map((x) => [x])}
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
            choices={[
              [true, 'yes'],
              [false, 'no'],
            ]}
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
        <th style={{ width: 120, whiteSpace: 'nowrap', fontSize: 12, border: '1px solid #ccc' }}>{key}</th>
        <td
          style={{
                 width: '100%',
                 border: '1px solid #ccc',
          }}
          >
          <div style={{ padding: 4 }}>
            {inputNode}
            <div style={{ fontSize: 12, padding: '4px 0', color: '#999' }}>
              {desc?.args && desc.args[key] && desc.args[key].description}
            </div>
            <Error small message={errors && errors[key]} />
          </div>
        </td>
      </tr>
    );
  };

  let basicKeys;
  let advancedKeys;
  if (meta?.basic) {
    basicKeys = keys.filter((key) => meta.basic[key]);
    advancedKeys = keys.filter((key) => !meta.basic[key]);
  } else {
    basicKeys = keys;
    advancedKeys = [];
  }
  const basicRows = basicKeys.map(renderField);
  const advancedRows = advancedKeys.map(renderField).filter(Boolean);

  return (
    <div>
      <StepHeader prettyName={prettyName} loading={loading} onDone={onDone} onSave={onSave} />

      <div>
        <table style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
          <tbody>{basicRows}</tbody>
        </table>
      </div>

      {advancedRows.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {!showAdvanced && <IoMdArrowDropright size={16} />}
            {showAdvanced && <IoMdArrowDropdown size={16} />}
            <div>Advanced</div>
          </div>
          <div style={{ display: showAdvanced ? 'block' : 'none' }}>
            <table style={{ tableLayout: 'fixed' }}>
              <tbody>{advancedRows}</tbody>
            </table>
          </div>
        </div>
      )}

      {/*
      <pre>desc:{JSON.stringify(desc, null, 2)}</pre>
      */}
    </div>
  );
};
