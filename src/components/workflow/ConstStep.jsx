import { useEffect, useState } from 'react';
import { StepHeader } from './StepHeader';
import { GenericStepEdit } from './GenericStepEdit';
import { Textarea } from '../input/Textarea';
import { TableFromItems } from '../table/TableFromItems';
import { Error } from '../error/Error';

export const ConstStep = ({ step, onEdit, editable, prettyName }) => {
  const nodes = step.args.items.map((item) => <div key={item.url}>{item.url}</div>);
  return (
    <div>
      <StepHeader onEdit={editable && onEdit} prettyName="Starting URLs" />
      <TableFromItems style={{ background: '#fff' }} noHeader items={step.args.items} />
    </div>
  );
};

export const ConstStepEdit = (props) => {
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
