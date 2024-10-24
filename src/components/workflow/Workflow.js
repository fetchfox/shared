import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowAltCircleDown,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,
} from 'react-icons/fa';
import { IoArrowUndo } from "react-icons/io5";
import {
  MdCancel,
  MdEditSquare,
  MdAddCircle,
  MdAddBox,
} from 'react-icons/md';

import { useSpring, animated, easings } from '@react-spring/web';

import { useGlobalContext }  from '@/src/contexts/index.js';

import { TableFromItems } from '@/src/components/table/TableFromItems';
import { Button } from '@/src/components/input/Button.js';
import { Input } from '@/src/components/input/Input.js';
import { Textarea } from '@/src/components/input/Textarea.js';
import { Error } from '@/src/components/error/Error.js';

import { primaryColor } from '@/src/constants.js';
import { endpoint } from '@/src/utils.js';

const ConstStep = ({ step, onEdit, prettyName }) => {
  const nodes = step.args.items.map(item => (
    <div key={item.url}>{item.url}</div>
  ))
  return (
    <div>
      <StepHeader
        onEdit={onEdit}
        prettyName="Starting URL" />
      {nodes}
    </div>
  );
}

const ConstStepEdit = (props) => {
  return (
    <GenericStepEdit
      {...props}
      innerComponent={ConstStepEditInner} />
  );
}
const ConstStepEditInner = ({
  key,
  step,
  workflow,
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
  const [urls, setUrls] = useState();

  useEffect(() => {
    if (!step?.args?.items) return;
    if (urls) return;
    setUrls(step.args.items.map(i => i.url).join('\n'));
  }, [step?.args?.items]);

  useEffect(() => {
    if (!step?.args) return;
    const items = [];
    for (const url of urls.split('\n')) {
      if (!url.trim()) continue;
      items.push({ url });
    };
    onChange('items', items);
  }, [urls]);

  return (
    <div>
      <StepHeader
        prettyName={prettyName}
        loading={loading}
        onDone={onDone}
        onSave={onSave}
      />
      <Textarea
        label="Enter one URL per line"
        placeholder="https://www.example.com/page"
        style={{ width: '100%', minHeight: 80 }}
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <Error small message={errors && errors.items} />
    </div>
  );
}

const NewStep = ({ onChange, onCancel }) => {
  const springs = useSpring({
    from: {
      opacity: 0.5,
      transform: 'scaleY(0)',
    },
    to: {
      opacity: 1,
      transform: 'scaleY(1)',
    },
    config: {
      duration: 250,
      easing: easings.easeOutBack,
    },
  });

  const { library } = useGlobalContext();

  const nodes = Object.keys(library)
    .filter(key => key != 'const')
    .map((key) => (
      <div
        style={{ background: '#fff',
                 padding: 10,
                 borderRadius: 8,
                 cursor: 'pointer',
                 border: '1px solid #ccc',
               }}
        key={key}
        onClick={() => onChange(key)}
        >
        <div
          style={{ fontWeight: 'bold',
                   fontSize: 14,
                   lineHeight: '16px',
                 }}
          >
          {library[key].name.upperFirst()}
        </div>
        <div
          style={{ lineHeight: '18px',
                   fontSize: 12,
                   marginTop: 5,
                 }}>
          {library[key].description}
        </div>
      </div>
    ));

  return (
    <animated.div style={{ transformOrigin: 'top center', ...springs }}>
      <div style={{ display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
        <p>What type of step should we add?</p>
        <Button
          small outline
          onClick={onCancel}
          >
          Cancel
        </Button>
      </div>
      <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridAutoRows: 'auto',
                    gap: 10 }}>
        {nodes}
      </div>

      {/*
      <pre>{JSON.stringify(library, null, 2)}</pre>
      */}
    </animated.div>
  );
}

const StepHeader = ({
  prettyName,
  loading,
  onEdit,
  onDone,
  onSave,
  onRemove,
}) => {
  return (
    <div style={{ display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
      >
      <div>{prettyName}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {onDone && <Button
          trans small
          onClick={onDone}
          >
          Cancel
        </Button>}
        {onRemove && <Button
          simple gray
          onClick={onRemove}
          tooltip="Remove"
          >
           <MdCancel size={18} />
        </Button>}
        {onSave && <Button
          small
          onClick={onSave}
          loading={loading}
          >
          Save
        </Button>}
        {onEdit && <Button
          simple gray
          onClick={onEdit}
          tooltip="Edit"
          >
         <MdEditSquare size={18} />
        </Button>}
      </div>
    </div>
  );
}

const GenericStep = ({ step, prettyName, onEdit, onRemove }) => {
  const { library } = useGlobalContext();
  const desc = library ? library[step?.name] : {};
  const keys = Object.keys(step?.args);

  // return (
  //   <div>
  //     {step?.name}<br/><br/>
  //     {JSON.stringify(desc)}<br/><br/>
  //     {JSON.stringify(keys)}<br/><br/>
  //     {JSON.stringify(library)}<br/><br/>
  //   </div>
  // );

  // const desc = library ? library[step?.name] : {};
  // const keys = Object.keys(step?.args);
  // const keys = Object.keys(desc?.args);

  if (!desc?.args) return null;

  const render = (key) => {
    if (!desc) return null;

    const argDesc = desc.args[key];

    console.log('key', key);
    console.log('step.args', step.args);
    console.log('argDesc', argDesc);

    switch (argDesc.format) {
      case 'list':
        return <ul>{step.args[key].map(x => <li>{x}</li>)}</ul>;

      case 'object':
        return JSON.stringify(step.args);

      case 'boolean':
        return step.args[key] ? 'yes' : 'no';

      case 'choices':
        return step.args[key];

      default:
        return JSON.stringify(step.args[key]);
    }
  }

  const rows = keys.map(key => (
    <tr>
      <th style={{ width: '100px', whiteSpace: 'nowrap' }}>{key.upperFirst()}</th>
      <td style={{ width: '100%' }}>{render(key)}</td>
    </tr>
  ));

  return (
    <div>
      <StepHeader
        prettyName={prettyName}
        onEdit={onEdit}
        onRemove={onRemove}
      />

      <table className="dense">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

const GenericStepEdit = (props) => {
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

  const desc = ctx.library[step?.name];

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

  return innerComponent({
    ...props,
    step: step_,
    desc,
    errors,
    loading,
    onSave: save,
    onChange: update,
  });
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

  const keys = Object.keys(step.args || {});
  const rows = keys.map(key => {
    if (!desc) return null;


    const argDesc = desc.args[key];
    let inputNode = (
      <div>
        TODO{JSON.stringify(argDesc.format)}<br/>
        TODO{JSON.stringify(step.args[key])}<br/>
      </div>
    );

    switch (argDesc.format) {
      case 'list':
        inputNode = (
          <ListInput
            style={{ width: '100%' }}
            value={step.args[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'choices':
        inputNode = (
          <Select
            style={{ width: '100%' }}
            choices={argDesc.choices.map(x => [x])}
            value={step.args[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      case 'boolean':
        inputNode = (
          <Select
            style={{ width: '100%' }}
            choices={[[true, 'yes'], [false, 'no']]}
            value={step.args[key]}
            onChange={(val) => onChange(key, val)}
          />
        );
        break;

      default:
        inputNode = (
          <Input
            style={{ width: '100%' }}
            value={step.args[key]}
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


export const Step = ({
  index,
  step,
  last,
  workflow,
  workflowId,
  onSubmit,
  onAddStep,
  onSetStepWithName,
  onRemove,
  onUndo,
}) => {

  const [loading, setLoading] = useState();
  const [editing, setEditing] = useState();

  useEffect(() => {
    let allNull = true;
    for (const key of Object.keys(step?.args || {})) {
      if (step.args[key] != null) allNull = false;
    }
    if (allNull) {
      setEditing(true);
    }
  }, [step?.name]);

  const cancel = () => {
    setEditing(false);
  }

  const wrap = (node) => {
    return (
      <form onSubmit={submit}>
        {node}
      </form>
    );
  }

  let node;
  let editNode;

  if (step.name == 'new') {
    editNode = (
      <NewStep
        onChange={(name) => onSetStepWithName(name, index)}
        onCancel={() => { onRemove() }}
      />
    );
  } else {
    //const fallbackPrettyName = `Step ${index + 1}: ${step.name.replace(/-/g, ' ').upperFirst()}`;
    const fallbackPrettyName = `${step.name.replace(/-/g, ' ').upperFirst()}`;

    const childProps = {
      index,
      step,
      onSubmit,
      onRemove: () => { setEditing(false); onRemove() },
      workflowId,
      onDone: () => setEditing(false),
      onEdit: () => setEditing(true),
    };
    let pair = {
      'const': [
        <ConstStep
          {...childProps}
          prettyName={`Initialize`}
        />,
        <ConstStepEdit
          {...childProps}
          prettyName={`Initialize`}
        />,
      ],
    //   'exportUrls': [
    //     <ExportUrlsStep
    //       index={index}
    //       step={step}
    //       workflow={workflow}
    //       prettyName={`Export Files`}
    //       onEdit={() => setEditing(true)}
    //       onRemove={onRemove}
    //     />,
    //     <ExportUrlsStepEdit
    //       index={index}
    //       step={step}
    //       workflow={workflow}
    //       prettyName={`Export Files`}
    //       onSubmit={onSubmit}
    //       onDone={() => setEditing(false)}
    //       onRemove={onRemove}
    //     />,
    //   ],
    }[step.name];

    if (!pair) {
      pair = [
        <GenericStep
          {...childProps}
          prettyName={fallbackPrettyName}
        />,
        <GenericStepEdit
          {...childProps}
          prettyName={fallbackPrettyName}
        />,
      ];
    }

    node = pair[0];
    editNode = pair[1];
  }

  return (
    <div>
      <div style={{ border: '1px solid #ccc',
                    background: '#fff',
                    boxShadow: `2px 2px #ddd`,
                    borderRadius: 4,
                    padding: 10,
                    fontSize: 14,
                  }}>
        {!editing && node}
        {editing && editNode}
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute',
                      right: 0,
                      height: 46,
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: 0,
                      padding: '0 10px',
                      width: '100%',
                      justifyContent: last ? 'center' : 'flex-end',
                    }}>
          {onUndo && <Button
           className="bt bt-white bt-sm"
             small trans
            onClick={onUndo}
            >
            <IoArrowUndo style={{ marginTop: -2 }} size={14} /> Undo
          </Button>}
          {<Button
            simple gray
            onClick={onAddStep}
            tooltip="Add Step"
            >
           <MdAddBox size={24} />
          </Button>}
        </div>
      {!last && (
        <div style={{ padding: 10,
                      width: '100%',
                      textAlign: 'center',
                      color: '#555',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
        }}>
        <FaArrowAltCircleDown size={24} />
        </div>
       )}
      </div>
    </div>
  );
}

export const Workflow = ({ workflow, onChange }) => {
  const { library } = useGlobalContext();
  const pairs = [];
  const steps = workflow?.steps || [];
  const [undoData, setUndoData] = useState();

  const handleSubmit = async (index, step) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps[index] = step;

    const resp = await fetch(
      endpoint(`/api/workflow/validate`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: copy.steps }),
      });
    const data = await resp.json();
    console.log('validate resp', data);
    if (data.errors) {
      return { errors: data.errors[index] };
    }

    if (workflow.id) {
      const data = await commit(copy);
      if (data.errors) return { errors: data.errors[index] };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  }

  const addStep = async (step, index) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps.splice(index, 0, step);

    if (step.name != 'new' && workflow.id) {
      const data = await commit(copy);
      if (data.errors) return { errors: data.errors[index] };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  }

  const undo = () => {
    addStep(undoData.step, undoData.index);
    setUndoData(null);
  }

  const setStepWithName = async (name, index) => {
    const s = { name, args: {} };
    const desc = library[name];
    for (const key of Object.keys(desc.args)) {
      s.args[key] = desc.args[key].default || null;
    }

    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps[index] = s;
    onChange(copy);
  }

  const removeStep = async (index) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    const removed = JSON.parse(JSON.stringify(copy.steps[index]));
    copy.steps.splice(index, 1);

    onChange(copy);
    setUndoData({ step: removed, index });
    setTimeout(() => setUndoData(null), 4000);

    if (workflow.id) {
      const data = await commit(copy);
      if (data.errors) return { errors: data.errors[index] };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  }

  // TODO
  const results = [];

  let resultsWithItems = [];
  if (results && Array.isArray(results)) {
    resultsWithItems = results;
      // .filter(x => (
      //   x.error ||
      //   x.didStart ||
      //   x.items && x.items.length > 0
      // ));
  }

  // Special case to show loading if:
  // - Last step in resultsWithItems is `done`
  // - The next item does not have `didStart` set
  if (
    resultsWithItems &&
    results &&
    resultsWithItems.length > 0 &&
    resultsWithItems.length < results.length &&
    resultsWithItems[resultsWithItems.length - 1].done)
  {
    // Deep copy and set it to `loading`
    resultsWithItems.push(JSON.parse(JSON.stringify(
      results[resultsWithItems.length]
    )));
    resultsWithItems[resultsWithItems.length - 1].loading = true;
  }

  for (let i = 0; i < steps.length; i++) {
    pairs.push({
      step: steps[i],
      result: i >= (resultsWithItems || []).length ? {} : resultsWithItems[i],
    });
  }

  let i = 0;
  const nodes = pairs.map(pair => {
    const index = i++;

    const props = {
      key: index,
      index: index,
      last: index == workflow?.steps.length - 1,
      lastResult: index == resultsWithItems.length - 1,
      // done: done,
      // running: running,
      step: pair.step,
      result: pair.result,
      workflow: workflow,
      workflowId: workflow.id,
      onSubmit: (val) => handleSubmit(index, val),
      onAddStep: () => addStep({ name: 'new', args: {} }, index + 1),
      onSetStepWithName: (name, index) => setStepWithName(name, index),
      onRemove: () => { removeStep(index) },
      onUndo: undoData?.index == index + 1 ? undo : null,
    };

    return <Step {...props} />;
    // if (withResults) {
    //   return <Pair {...props} />;
    // } else {
    //   return <Step {...props} />;
    // }
  });

  return (
    <div>
      {nodes}
    </div>
  )
}
