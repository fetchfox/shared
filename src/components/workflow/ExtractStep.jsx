import { useEffect, useState } from 'react';
import { StepHeader } from './StepHeader';
import { GenericStepEdit } from './GenericStep';
import { Textarea } from '../input/Textarea';
import { Select } from '../input/Select';
import { DictInput } from '../input/DictInput';
import { Table } from '../table/Table';
import { Error } from '../error/Error';

export const ExtractStep = ({ step, onEdit, editable, prettyName, onRemove }) => {
  // const nodes = step.args.items.map((item) => <div key={item.url}>{item.url}</div>);

  const questions = (step.args?.questions || {});

  let maxPagesNode;
  if (step.args?.maxPages && step.args?.maxPages > 1) {
    maxPagesNode = (
      <span>
        find up to <b>{step.args.maxPages}</b> pages
      </span>
    );
  } else {
    maxPagesNode = (
      <span>
        do not paginate
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <StepHeader prettyName="Extract data" onEdit={editable && onEdit} onRemove={onRemove} />
      <Table
        cellStyles={[{ width: '10%' }]}
        rows={Object.keys(questions).map((k) => [<b>{k}</b>, '' + questions[k]])}
      />

      <div>
        {step.args.single ? <span>Extract <b>one</b> item per page</span> : <span>Extract <b>multiple</b> items per page</span>}, {maxPagesNode}
      </div>
    </div>
  );
};
      // <StepHeader onEdit={editable && onEdit} prettyName="Starting URLs" />
      // <TableFromItems style={{ background: '#fff' }} noHeader items={step.args.items} />

export const ExtractStepEdit = (props) => {
  return <GenericStepEdit {...props} innerComponent={ExtractStepEditInner} />;
};

const ExtractStepEditInner = ({
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
  const stepArgs = step?.args || {};

  const handleSingle = (val) => {
    onChange('single', val);
    if (val) {
      onChange('maxPages', 1);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <StepHeader prettyName={prettyName} loading={loading} onDone={onDone} onSave={onSave} />
      <DictInput
        style={{ width: '100%' }}
        value={stepArgs.questions}
        onChange={(val) => onChange('questions', val)}
      />
      <Select
        label="Results per page"
        key={key}
        style={{ width: '100%' }}
        choices={[
                 [true, 'One per page'],
                 [false, 'Multiple per page'],
                 ]}
        value={stepArgs.single}
        onChange={handleSingle}
      />
      {!stepArgs.single && <Select
        label="Max pagination"
        key={key}
        style={{ width: '100%' }}
        choices={[
                 [1, 'Do not follow pagination'],
                 [2, 'Up to 2 pages'],
                 [3, 'Up to 3 pages'],
                 [4, 'Up to 4 pages'],
                 [5, 'Up to 5 pages'],
                 [10, 'Up to 10 pages'],
                 [25, 'Up to 25 pages'],
                 [50, 'Up to 50 pages'],
                 [100, 'Up to 100 pages'],
                 [1000, 'Up to 1000 pages'],
                 ]}
        value={stepArgs.maxPages}
        onChange={(val) => onChange('maxPages', val)}
      />}
    </div>
  )
};
