export const endpoint = (path) => {
  return `${currentApiHost.apiHost}${path}`;
};

export const setApiHost = (host) => {
  currentApiHost.apiHost = host;
};

export let currentApiHost = { apiHost: null };
export let currentApiKey = { apiKey: null };

export function callApi(method, urlEndpoint, data) {
  console.log('Call API', method, urlEndpoint, data);

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
