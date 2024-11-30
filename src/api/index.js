import { apiHost } from '../constants';

export const endpoint = (path) => {
  return `${apiHost}${path}`;
};

export let currentApiKey = { apiKey: null };

export function callApi(method, urlEndpoint, data) {
  const params = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (data) {
    params.body = JSON.stringify(data);
  }

  if (urlEndpoint.startsWith('/api/v2')) {
    const { apiKey } = currentApiKey;
    if (apiKey) {
      params.headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }

  return fetch(endpoint(urlEndpoint), params);
}

export const generateApiKey = async () => {
  const resp = await callApi('POST', '/api/key/generate');
  return await resp.json();
};
