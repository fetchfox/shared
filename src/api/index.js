import { endpoint } from '@/src/utils.js';

export const generateApiKey = async () => {
  const resp = await fetch(
    endpoint(`/api/key/generate`),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  return await resp.json();
}
