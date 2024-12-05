import React, { useState } from 'react';
import { Button } from '../input/Button';

export const AsCode = ({ workflow }) => {
  const [lang, setLang] = useState('json');

  const options = {
    limit: workflow.options?.limit,
    fetcher: 'playwright',
  };

  const apiKey = workflow.options?.apiKey;
  const json = JSON.stringify({ steps: workflow?.steps, options }, null, 2)
  const code = {
    json,
    js: `import { fox } from 'fetchfox';

const json = ${json};

const workflow = await fox.load(json);
const out = await workflow.run(null, (partial) => {
  console.log('Partial result:', partial.item);
});
console.log('Final result:', out.items);`,
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 5 }}>
        {[
          ['json', 'JSON'],
          ['js', 'JavaScript'],
         ].map(([l, pretty]) => (
          <Button
          small
          trans
           gray={lang != l}
           black={lang == l}
           onClick={() => setLang(l)}
           >{pretty}</Button>
         ))
         }
      </div>
      <textarea
        rows={16}
        style={{ width: '100%', fontSize: 12, border: '1px solid #ccc' }}
        value={code[lang]}
      />
    </div>
  );
}
