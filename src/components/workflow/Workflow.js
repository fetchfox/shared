import React, { useState, useEffect, useRef } from 'react';
import { FaArrowAltCircleDown, FaCheckCircle } from 'react-icons/fa';
import { IoArrowUndo } from "react-icons/io5";
import { useGlobalContext }  from '@/src/contexts/index.js';

import { primaryColor } from '@/src/constants.js';

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
      {/*(<StepHeader
        prettyName={prettyName}
        onEdit={onEdit}
        onRemove={onRemove}
      />*/}

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
  workflow,
  workflowId,
  extraClasses,
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
        onCancel={onRemove}
      />
    );
  } else {
    //const fallbackPrettyName = `Step ${index + 1}: ${step.name.replace(/-/g, ' ').upperFirst()}`;
    const fallbackPrettyName = `${step.name.replace(/-/g, ' ').upperFirst()}`;

    let pair = null;

    // let pair = {
    //   'const': [
    //     <ConstStep
    //       index={index}
    //       step={step}
    //       prettyName={`Initialize`}
    //     />,
    //     null,
    //   ],
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
    // }[step.name];

    if (!pair) {
      pair = [
        <GenericStep
          index={index}
          step={step}
          prettyName={fallbackPrettyName}
          onEdit={() => setEditing(true)}
          onRemove={onRemove}
        />,
        null,
        // <GenericStepEdit
        //   step={step}
        //   index={index}
        //   workflowId={workflowId}
        //   prettyName={fallbackPrettyName}
        //   onSubmit={onSubmit}
        //   onDone={() => setEditing(false)}
        //   onRemove={onRemove}
        // />,
      ];
    }

    node = pair[0];
    editNode = pair[1];
  }

  return (
    <div className={extraClasses}>
      <div style={{ border: '1px solid #ccc',
                    background: '#f3f3f3',
                    boxShadow: `2px 2px #eee`,
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
                    }}>
          {onUndo && <button
            className="bt bt-white bt-sm"
            onClick={onUndo}
            >
            <IoArrowUndo style={{ marginTop: -2 }} size={14} /> Undo
          </button>}
          {<button
            className="bt bt-white bt-sm"
            onClick={onAddStep}
            >
            Add Step
          </button>}
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

export const Workflow = ({ workflow }) => {
  const pairs = [];
  const steps = workflow?.steps || [];

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
      // onSubmit: (val) => handleSubmit(index, val),
      // onAddStep: () => addStep({ name: 'new', args: {} }, index + 1),
      // onSetStepWithName: (name, index) => setStepWithName(name, index),
      // onRemove: () => removeStep(index),
      // onUndo: undoData?.index == index + 1 ? undo : null,
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
