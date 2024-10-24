import React, { useState, useEffect, useRef } from 'react';
import { FaArrowAltCircleDown, FaCheckCircle } from 'react-icons/fa';
import { IoArrowUndo } from "react-icons/io5";
import { useGlobalContext } from "../../contexts/index.js";
import { Button } from "../input/Button.js";
import { Input } from "../input/Input.js";
import { Error } from "../error/Error.js";
import { primaryColor } from "../../constants.js";
import { endpoint } from "../../utils.js";
const NewStep = ({
  onChange,
  onCancel
}) => {
  const {
    library
  } = useGlobalContext();
  const nodes = Object.keys(library).filter(key => key != 'const').map(key => /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: 10,
      borderRadius: 8,
      cursor: 'pointer',
      border: '1px solid #ccc'
    },
    key: key,
    onClick: () => onChange(key)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '16px'
    }
  }, library[key].name.upperFirst()), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: '18px',
      fontSize: 12,
      marginTop: 5
    }
  }, library[key].description)));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("p", null, "What type of step should we add?"), /*#__PURE__*/React.createElement("button", {
    className: "bt bt-outline bt-sm",
    onClick: onCancel
  }, "Cancel")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridAutoRows: 'auto',
      gap: 10
    }
  }, nodes));
};
const StepHeader = ({
  prettyName,
  loading,
  onEdit,
  onDone,
  onSave,
  onRemove
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", null, prettyName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, onDone && /*#__PURE__*/React.createElement(Button, {
    className: "bt bt-trans bt-sm",
    onClick: onDone
  }, "Cancel"), onRemove && /*#__PURE__*/React.createElement(Button, {
    className: "bt bt-trans bt-sm",
    onClick: onRemove
  }, "Remove"), onSave && /*#__PURE__*/React.createElement(Button, {
    className: "bt bt-sm",
    onClick: onSave,
    loading: loading
  }, "Save"), onEdit && /*#__PURE__*/React.createElement(Button, {
    className: "bt bt-trans bt-sm",
    onClick: onEdit
  }, "Edit")));
};
const GenericStep = ({
  step,
  prettyName,
  onEdit,
  onRemove
}) => {
  const {
    library
  } = useGlobalContext();
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
  const render = key => {
    if (!desc) return null;
    const argDesc = desc.args[key];
    console.log('key', key);
    console.log('step.args', step.args);
    console.log('argDesc', argDesc);
    switch (argDesc.format) {
      case 'list':
        return /*#__PURE__*/React.createElement("ul", null, step.args[key].map(x => /*#__PURE__*/React.createElement("li", null, x)));
      case 'object':
        return JSON.stringify(step.args);
      case 'boolean':
        return step.args[key] ? 'yes' : 'no';
      case 'choices':
        return step.args[key];
      default:
        return JSON.stringify(step.args[key]);
    }
  };
  const rows = keys.map(key => /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px',
      whiteSpace: 'nowrap'
    }
  }, key.upperFirst()), /*#__PURE__*/React.createElement("td", {
    style: {
      width: '100%'
    }
  }, render(key))));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
    prettyName: prettyName,
    onEdit: onEdit,
    onRemove: onRemove
  }), /*#__PURE__*/React.createElement("table", {
    className: "dense"
  }, /*#__PURE__*/React.createElement("tbody", null, rows)));
};
const GenericStepEdit = props => {
  const {
    step,
    index,
    workflowId,
    prettyName,
    onSubmit,
    onDone,
    onRemove
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
    const copy = {
      ...step_
    };
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
      onDone();
    }
    setLoading(false);
  };
  return innerComponent({
    ...props,
    step: step_,
    desc,
    errors,
    loading,
    onSave: save,
    onChange: update
  });
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
  onSave
}) => {
  const keys = Object.keys(step.args || {});
  const rows = keys.map(key => {
    if (!desc) return null;
    const argDesc = desc.args[key];
    let inputNode = /*#__PURE__*/React.createElement("div", null, "TODO", JSON.stringify(argDesc.format), /*#__PURE__*/React.createElement("br", null), "TODO", JSON.stringify(step.args[key]), /*#__PURE__*/React.createElement("br", null));
    switch (argDesc.format) {
      case 'list':
        inputNode = /*#__PURE__*/React.createElement(ListInput, {
          style: {
            width: '100%'
          },
          value: step.args[key],
          onChange: val => onChange(key, val)
        });
        break;
      case 'choices':
        inputNode = /*#__PURE__*/React.createElement(Select, {
          style: {
            width: '100%'
          },
          choices: argDesc.choices.map(x => [x]),
          value: step.args[key],
          onChange: val => onChange(key, val)
        });
        break;
      case 'boolean':
        inputNode = /*#__PURE__*/React.createElement(Select, {
          style: {
            width: '100%'
          },
          choices: [[true, 'yes'], [false, 'no']],
          value: step.args[key],
          onChange: val => onChange(key, val)
        });
        break;
      default:
        inputNode = /*#__PURE__*/React.createElement(Input, {
          style: {
            width: '100%'
          },
          value: step.args[key],
          onChange: e => onChange(key, e.target.value)
        });
        break;
    }
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        whiteSpace: 'nowrap'
      }
    }, key.upperFirst()), /*#__PURE__*/React.createElement("td", {
      style: {
        width: '100%'
      }
    }, inputNode, /*#__PURE__*/React.createElement(Error, {
      small: true,
      message: errors && errors[key]
    })));
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
    prettyName: prettyName,
    loading: loading,
    onDone: onDone,
    onSave: onSave
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    className: "dense"
  }, /*#__PURE__*/React.createElement("tbody", null, rows))));
};
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
  onUndo
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
  };
  const wrap = node => {
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: submit
    }, node);
  };
  let node;
  let editNode;
  if (step.name == 'new') {
    editNode = /*#__PURE__*/React.createElement(NewStep, {
      onChange: name => onSetStepWithName(name, index),
      onCancel: onRemove
    });
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
      pair = [/*#__PURE__*/React.createElement(GenericStep, {
        index: index,
        step: step,
        prettyName: fallbackPrettyName,
        onEdit: () => setEditing(true),
        onRemove: onRemove
      }), /*#__PURE__*/React.createElement(GenericStepEdit, {
        step: step,
        index: index,
        workflowId: workflowId,
        prettyName: fallbackPrettyName,
        onSubmit: onSubmit,
        onDone: () => setEditing(false),
        onRemove: onRemove
      })];
    }
    node = pair[0];
    editNode = pair[1];
  }
  return /*#__PURE__*/React.createElement("div", {
    className: extraClasses
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #ccc',
      background: '#f3f3f3',
      boxShadow: `2px 2px #eee`,
      borderRadius: 4,
      padding: 10,
      fontSize: 14
    }
  }, !editing && node, editing && editNode), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      height: 46,
      display: 'flex',
      alignItems: 'center'
    }
  }, onUndo && /*#__PURE__*/React.createElement("button", {
    className: "bt bt-white bt-sm",
    onClick: onUndo
  }, /*#__PURE__*/React.createElement(IoArrowUndo, {
    style: {
      marginTop: -2
    },
    size: 14
  }), " Undo"), /*#__PURE__*/React.createElement("button", {
    className: "bt bt-white bt-sm",
    onClick: onAddStep
  }, "Add Step")), !last && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      width: '100%',
      textAlign: 'center',
      color: primaryColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(FaArrowAltCircleDown, {
    size: 24
  }))));
};
export const Workflow = ({
  workflow,
  onChange
}) => {
  const {
    library
  } = useGlobalContext();
  const pairs = [];
  const steps = workflow?.steps || [];
  const [undoData, setUndoData] = useState();
  const handleSubmit = async (index, step) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps[index] = step;
    const resp = await fetch(endpoint(`/api/workflow/validate`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        steps: copy.steps
      })
    });
    const data = await resp.json();
    console.log('validate resp', data);
    if (data.errors) {
      return {
        errors: data.errors[index]
      };
    }
    if (workflow.id) {
      const data = await commit(copy);
      if (data.errors) return {
        errors: data.errors[index]
      };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  };
  const addStep = async (step, index) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps.splice(index, 0, step);

    // const d = {};
    // d[index] = 'add-animation';
    // setExtraClasses(d);
    // setTimeout(() => setExtraClasses(d), 1);
    // setTimeout(() => setExtraClasses({}), 150);

    if (step.name != 'new' && workflow.id) {
      const data = await commit(copy);
      if (data.errors) return {
        errors: data.errors[index]
      };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  };
  const undo = () => {
    addStep(undoData.step, undoData.index);
    setUndoData(null);
  };
  const setStepWithName = async (name, index) => {
    const s = {
      name,
      args: {}
    };
    const desc = library[name];
    for (const key of Object.keys(desc.args)) {
      s.args[key] = desc.args[key].default || null;
    }
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps[index] = s;
    onChange(copy);
  };
  const removeStep = async index => {
    const copy = JSON.parse(JSON.stringify(workflow));
    const removed = JSON.parse(JSON.stringify(copy.steps[index]));
    copy.steps.splice(index, 1);
    onChange(copy);
    setUndoData({
      step: removed,
      index
    });
    setTimeout(() => setUndoData(null), 4000);
    if (workflow.id) {
      const data = await commit(copy);
      if (data.errors) return {
        errors: data.errors[index]
      };
      onChange(data.workflow);
    } else {
      onChange(copy);
    }
  };

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
  if (resultsWithItems && results && resultsWithItems.length > 0 && resultsWithItems.length < results.length && resultsWithItems[resultsWithItems.length - 1].done) {
    // Deep copy and set it to `loading`
    resultsWithItems.push(JSON.parse(JSON.stringify(results[resultsWithItems.length])));
    resultsWithItems[resultsWithItems.length - 1].loading = true;
  }
  for (let i = 0; i < steps.length; i++) {
    pairs.push({
      step: steps[i],
      result: i >= (resultsWithItems || []).length ? {} : resultsWithItems[i]
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
      onSubmit: val => handleSubmit(index, val),
      onAddStep: () => addStep({
        name: 'new',
        args: {}
      }, index + 1),
      onSetStepWithName: (name, index) => setStepWithName(name, index),
      onRemove: () => removeStep(index),
      onUndo: undoData?.index == index + 1 ? undo : null
    };
    return /*#__PURE__*/React.createElement(Step, props);
    // if (withResults) {
    //   return <Pair {...props} />;
    // } else {
    //   return <Step {...props} />;
    // }
  });
  return /*#__PURE__*/React.createElement("div", null, nodes);
};
//# sourceMappingURL=Workflow.js.map