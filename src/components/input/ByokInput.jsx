import { useModels } from '../../state/ai';
import { Loading } from '../common/Loading';
import { Error } from '../error/Error';
import { Input } from './Input';
import { Select } from './Select';

export const ByokInput = ({ value, onChange }) => {
  const apiKey = value[value.provider] ? value[value.provider].apiKey : '';
  const model = value[value.provider] ? value[value.provider].model : '';

  const { models, loading } = useModels(value.provider, apiKey);

  const ok = apiKey && (loading || models.length > 0);

  const choices = [
    ['openai', 'OpenAI'],
    // ['anthropic', 'Anthropic'],
  ];
  const expand = (val) => {
    for (const c of choices) {
      if (c[0] == val) return c[1] + ' ';
    }
    return '';
  };

  const p = value[value.provider];

  const change = (field, val) => {
    const delta = {};
    delta[value.provider] = {
      apiKey: p?.apiKey,
      model: p?.model,
    };
    delta[value.provider][field] = val;
    onChange(delta);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}>
      <Select
        style={{ width: '100%' }}
        choices={choices}
        value={value.provider}
        onChange={(val) => onChange({ provider: val })}
      />

      {value.provider && (
        <Input
          style={{ width: '100%' }}
          value={apiKey}
          onChange={(e) => change('apiKey', e.target.value)}
          placeholder={`Enter your ${expand(value?.provider || '')}API key`}
        />
      )}
      {value.provider && p?.apiKey && !loading && !ok && <Error small message="API key not working" />}

      {value.provider && p?.apiKey && (
        <Select
          style={{ width: '100%' }}
          choices={(models || []).map((x) => [x])}
          value={model}
          onChange={(val) => change('model', val)}
        />
      )}
      {value.provider && p?.apiKey && loading && <Loading size={18} />}
    </div>
  );
};
