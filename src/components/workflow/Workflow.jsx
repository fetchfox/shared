import { useEffect, useState } from 'react';
import { FaArrowAltCircleDown, FaCode } from 'react-icons/fa';
import { IoArrowUndo } from 'react-icons/io5';
import { MdAddBox } from 'react-icons/md';

import { animated, easings, useSpring } from '@react-spring/web';

import { useGlobalContext } from '../../contexts';

import { Error } from '../error/Error';
import { Button } from '../input/Button';
import { Textarea } from '../input/Textarea';
import { Modal } from '../modal/Modal';
import { Table } from '../table/Table';
import { TableFromItems } from '../table/TableFromItems';

import { primaryColor } from '../../constants';
import { camelToHuman } from '../../utils';
import { endpoint } from '../../api';

import { GenericStepEdit } from './GenericStepEdit';
import { GlobalOptions } from './GlobalOptions';
import { Result } from './Results';
import { StepHeader } from './StepHeader';

export const fieldsMeta = {
  crawl: {
    primary: 'query',
    basic: { query: true },
  },
  fetch: {
    basic: {
      urlFields: true,
    },
  },
  extract: {
    primary: 'questions',
    basic: {
      questions: true,
      single: true,
    },
  },
  filter: {
    basic: {
      query: true,
    },
  },
};

const ConstStep = ({ step, onEdit, editable, prettyName }) => {
  const nodes = step.args.items.map((item) => <div key={item.url}>{item.url}</div>);
  return (
    <div>
      <StepHeader onEdit={editable && onEdit} prettyName="Starting URLs" />
      <TableFromItems style={{ background: '#fff' }} noHeader items={step.args.items} />
    </div>
  );
};

const ConstStepEdit = (props) => {
  return <GenericStepEdit {...props} innerComponent={ConstStepEditInner} />;
};
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
    setUrls(step.args.items.map((i) => i.url).join('\n'));
  }, [step?.args?.items]);

  useEffect(() => {
    if (!step?.args) return;
    const items = [];
    for (const url of urls.split('\n')) {
      if (!url.trim()) continue;
      items.push({ url });
    }
    onChange('items', items);
  }, [urls]);

  return (
    <div>
      <StepHeader prettyName={prettyName} loading={loading} onDone={onDone} onSave={onSave} />
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
};

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

  const allowed = {
    crawl: 'Find more urls',
    extract: 'Get data from a page',
    filter: 'Filter the results',
    limit: 'Limit the number of results',
    unique: 'Keep only unique items based on a field',
  };

  const nodes = Object.keys(library)
    .filter((key) => allowed[key])
    .map((key) => (
      <div
        style={{ background: '#fff', padding: 10, borderRadius: 8, cursor: 'pointer', border: '1px solid #ccc' }}
        key={key}
        onClick={() => onChange(key)}
      >
        <div style={{ fontWeight: 'bold', fontSize: 14, lineHeight: '16px' }}>{camelToHuman(library[key].name)}</div>
        <div style={{ lineHeight: '18px', fontSize: 12, marginTop: 5 }}>{allowed[key]}</div>
      </div>
    ));

  return (
    <animated.div style={{ transformOrigin: 'top center', ...springs }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p>What type of step should we add?</p>
        <Button small outline onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'auto', gap: 10 }}>
        {nodes}
      </div>

      {/*
      <pre>{JSON.stringify(library, null, 2)}</pre>
      */}
    </animated.div>
  );
};

const GenericStep = ({ step, prettyName, editable, onEdit, onRemove }) => {
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

export const Step = ({
  index,
  step,
  result,
  last,
  editable,
  workflow,
  workflowId,
  onSubmit,
  onAddStep,
  onSetStepWithName,
  onRemove,
  onUndo,
  onEditing,
}) => {
  const [loading, setLoading] = useState();
  const [editing, setEditing] = useState();

  useEffect(() => {
    onEditing && onEditing(editing);
  }, [editing]);

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

  const wrap = (node) => {
    return <form onSubmit={submit}>{node}</form>;
  };

  let node;
  let editNode;
  let prettyName;

  if (step.name == 'new') {
    editNode = (
      <NewStep
        onChange={(name) => onSetStepWithName(name, index)}
        onCancel={() => {
          onRemove();
        }}
      />
    );
  } else {
    prettyName = {
      crawl: 'Find more URLs',
      extract: 'Extract data',
    }[step.name];
    if (!prettyName) {
      prettyName = `${camelToHuman(step.name.replace(/-/g, ' '))}`;
    }

    const childProps = {
      index,
      step,
      editable,
      onSubmit,
      onRemove: () => {
        setEditing(false);
        onRemove();
      },
      workflowId,
      onDone: () => setEditing(false),
      onEdit: () => setEditing(true),
    };
    let pair = {
      const: [
        <ConstStep {...childProps} prettyName={`Initialize`} />,
        <ConstStepEdit {...childProps} prettyName={`Initialize`} />,
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

  let resultBg = result?.items ? '#eee' : 'transparent';

  let resultNode;
  if (result) {
    resultNode = (
      <div style={{ width: '50%', padding: 10, border: '1px solid #ccc', background: '#eee', borderRadius: 8 }}>
        <Result index={index} result={result} inner />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', width: '100%', borderRadius: 8, gap: 20 }}>
        <div
          style={{
            border: '1px solid #ccc',
            background: 'white',
            boxShadow: `2px 2px #eee`,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            width: result ? '50%' : '100%',
            height_x: '1%',
          }}
        >
          {!editing && node}
          {editing && editNode}
        </div>
        {resultNode}
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            right: result ? 'calc(50vw - 12px)' : 0,
            height: 46,
            display: 'flex',
            alignItems: 'center',
            marginRight: 0,
            padding: 0,
            width: result ? '50%' : '100%',
            justifyContent: last ? 'center' : 'flex-end',
          }}
        >
          {onUndo && (
            <Button className="bt bt-white bt-sm" small trans onClick={onUndo}>
              <IoArrowUndo style={{ marginTop: -2 }} size={14} /> Undo
            </Button>
          )}
          {editable && (
            <Button simple gray trans onClick={onAddStep} tooltip="Add Step">
              <MdAddBox size={24} />
            </Button>
          )}
        </div>
        {!last && (
          <div
            style={{
              padding: 10,
              width: result ? '50%' : '100%',
              textAlign: 'center',
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaArrowAltCircleDown size={24} />
          </div>
        )}

        {/*
        <pre>{JSON.stringify(result, null, 2)}</pre>
        */}
      </div>
    </div>
  );
};

export const Workflow = ({ workflow, results, editable, onChange, onEditing }) => {
  const { library } = useGlobalContext();
  const pairs = [];
  const [steps, setSteps] = useState([]);
  const [undoData, setUndoData] = useState();
  const [editing, setEditing] = useState();

  useEffect(() => {
    if (!workflow?.steps) return;
    setSteps(workflow.steps);
  }, [workflow?.steps]);

  const handleEditing = (editing_) => {
    setEditing(editing_);
    onEditing && onEditing(editing_);
  };

  const handleSubmit = async (index, step) => {
    const copySteps = JSON.parse(JSON.stringify(steps));
    copySteps[index] = step;

    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps = copySteps;

    const url = endpoint(`/api/workflow/validate`);
    console.log('validate url', url);
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps: copy.steps }),
    });
    const data = await resp.json();
    console.log('validate resp', data);
    if (data.errors) {
      return { errors: data.errors[index] };
    }

    return onChange(copy);
  };

  const addStep = async (step, index) => {
    const copy = JSON.parse(JSON.stringify(workflow));
    copy.steps.splice(index, 0, step);
    setSteps(copy.steps);
  };

  const undo = () => {
    addStep(undoData.step, undoData.index);
    setUndoData(null);
  };

  const setStepWithName = async (name, index) => {
    const s = { name, args: {} };
    const desc = library[name];
    for (const key of Object.keys(desc.args)) {
      s.args[key] = desc.args[key].default || null;
    }

    const copySteps = JSON.parse(JSON.stringify(steps));
    copySteps[index] = s;
    setSteps(copySteps);
  };

  const removeStep = async (index) => {
    const copy = JSON.parse(JSON.stringify(steps));
    const removed = JSON.parse(JSON.stringify(steps[index]));
    copy.splice(index, 1);
    setSteps(copy);

    if (removed.name != 'new') {
      const copyWorkflow = JSON.parse(JSON.stringify(workflow));
      copyWorkflow.steps = copy;
      onChange(copyWorkflow);
    }

    setUndoData({ step: removed, index });
    setTimeout(() => setUndoData(null), 4000);
  };

  // const results = [];

  let resultsWithItems = [];
  if (results && Array.isArray(results)) {
    resultsWithItems = results;
  }

  // // Special case to show loading if:
  // // - Last step in resultsWithItems is `done`
  // // - The next item does not have `didStart` set
  // if (
  //   resultsWithItems &&
  //   results &&
  //   resultsWithItems.length > 0 &&
  //   resultsWithItems.length < results.length &&
  //   resultsWithItems[resultsWithItems.length - 1].done)
  // {
  //   // Deep copy and set it to `loading`
  //   resultsWithItems.push(JSON.parse(JSON.stringify(
  //     results[resultsWithItems.length]
  //   )));
  //   resultsWithItems[resultsWithItems.length - 1].loading = true;
  // }

  for (let i = 0; i < steps.length; i++) {
    let result;
    if (results) {
      if (i >= results.length) {
        result = {};
      } else {
        result = results[i];
      }
    }
    pairs.push({
      step: steps[i],
      result,
    });
  }

  let i = 0;
  const nodes = pairs.map((pair) => {
    const index = i++;

    const props = {
      index: index,
      last: index == steps.length - 1,
      lastResult: index == resultsWithItems.length - 1,
      editable: !editing,
      step: pair.step,
      result: pair.result,
      workflow: workflow,
      workflowId: workflow.id,
      onEditing: handleEditing,
      onSubmit: (val) => handleSubmit(index, val),
      onAddStep: () => addStep({ name: 'new', args: {} }, index + 1),
      onSetStepWithName: (name, index) => setStepWithName(name, index),
      onRemove: () => {
        removeStep(index);
      },
      onUndo_disabled: undoData?.index == index + 1 ? undo : null,
    };

    return <Step key={pair.step.name + '-' + index} {...props} />;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GlobalOptions workflow={workflow} onChange={onChange} />

        <Modal title="Scraper JSON">
          <FaCode color="#888" size={16} />
          <div style={{ maxWidth: 500 }}>
            <p>
              JSON definition of this scrape job is below. Visit our GitHub for more information on running using code:{' '}
              <a href="https://github.com/fetchfox/fetchfox" target="_blank">
                https://github.com/fetchfox/fetchfox
              </a>
            </p>
            <br />
            <textarea
              rows={16}
              style={{ width: '100%', fontSize: 12, border: '1px solid #ccc' }}
              value={JSON.stringify({ steps: workflow?.steps, options: workflow?.options }, null, 2)}
            />
          </div>
        </Modal>
      </div>

      {/*
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
      */}
      <br />
      {nodes}
    </div>
  );
};
