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
import { ListInput } from '@/src/components/input/ListInput.js';
import { DictInput } from '@/src/components/input/DictInput.js';
import { Select } from '@/src/components/input/Select.js';
import { Textarea } from '@/src/components/input/Textarea.js';
import { Error } from '@/src/components/error/Error.js';

import { primaryColor } from '@/src/constants.js';
import { endpoint } from '@/src/utils.js';

import { StepHeader } from './StepHeader.js';
import { GenericStepEdit } from './GenericStepEdit.js';
import { GlobalOptions } from './GlobalOptions.js';
import './Workflow.css';

const ConstStep = ({ step, onEdit, editable, prettyName }) => {
  const nodes = step.args.items.map(item => (
    <div key={item.url}>{item.url}</div>
  ))
  return (
    <div>
      <StepHeader
        onEdit={editable && onEdit}
        prettyName="Starting URLs" />
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

const GenericStep = ({ step, prettyName, editable, onEdit, onRemove }) => {
  const { library } = useGlobalContext();
  const desc = library ? library[step?.name] : {};
  const keys = Object.keys(step?.args);

  if (!desc?.args) return null;

  const render = (key) => {
    if (!desc) return null;

    const argDesc = desc.args[key];
    const arg = step.args[key];

    switch (argDesc.format) {
      case 'list':
        return <ul>{arg.map(x => <li>{x}</li>)}</ul>;

      case 'object':
        return (
          <table>
            <tbody>
              {Object.keys(arg).map(k => <tr><th style={{ width: '10%' }}>{k}</th><td>{arg[k]}</td></tr>)}
            </tbody>
          </table>
        );

      case 'boolean':
        return arg ? 'yes' : 'no';

      case 'number':
      case 'string':
      case 'choices':
        return arg;

      default:
        return <div>{argDesc.format} {JSON.stringify(arg)}</div>;
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
        onEdit={editable && onEdit}
        onRemove={editable && onRemove}
      />

      <table className="dense">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export const Step = ({
  index,
  step,
  last,
  editable,
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
  let prettyName;

  if (step.name == 'new') {
    editNode = (
      <NewStep
        onChange={(name) => onSetStepWithName(name, index)}
        onCancel={() => { onRemove() }}
      />
    );
  } else {
    prettyName = {
      crawl: 'Find more URLs',
      extract: 'Extract data',
    }[step.name];
    if (!prettyName) {
      prettyName = `${step.name.replace(/-/g, ' ').upperFirst()}`;
    }

    const childProps = {
      index,
      step,
      editable,
      onSubmit,
      onRemove: () => { setEditing(false); onRemove() },
      workflowId,
      onDone: () => setEditing(false),
      onEdit: () => setEditing(true),
    };
    let pair = {
      'const': [
        <ConstStep {...childProps} prettyName={`Initialize`} />,
        <ConstStepEdit{...childProps} prettyName={`Initialize`} />,
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
        <GenericStep {...childProps} prettyName={prettyName} />,
        <GenericStepEdit {...childProps} prettyName={prettyName} />,
      ];
    }

    node = pair[0];
    editNode = pair[1];
  }

  return (
    <div className="Step">
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
          {editable && <Button
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
                      color: primaryColor,
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

export const Workflow = ({ workflow, editable, onChange }) => {
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

    console.log('ONCHANGE', copy);

    onChange(copy);
  }

  const addStep = async (step, index) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps.splice(index, 0, step);
    onChange(copy);
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
      editable,
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
  });

  return (
    <div>
      <GlobalOptions
        workflow={workflow}
        onChange={onChange}
      />
      {/*
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
      */}
      <br />
      {nodes}
    </div>
  )
}
