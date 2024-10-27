import React, { useState, useEffect, useRef } from 'react';

export const useCheckApiKey = () => {
  return true;
}

export const useModels = (provider, apiKey) => {
  const [loading, setLoading] = useState();
  const [models, setModels] = useState([]);

  const timeoutRef = useRef();

  useEffect(() => {
    if (!provider || !apiKey){
      setModels([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setModels([]);
    timeoutRef.current = setTimeout(
      () => {
        console.log('call');

        const fn = {
          openai: getOpenAiModels,
        }[provider];

        if (!fn) {
          setLoading(false);
          return;
        }

        fn(apiKey)
          .then(data => {
            setModels(data);
            setLoading(false);
          });
      },
      1000);
  }, [provider, apiKey]);

  return { loading, models };
}

const getOpenAiModels = async (apiKey) => {
  const resp = await fetch(
    'https://api.openai.com/v1/models',
    { headers: { Authorization: 'Bearer ' + apiKey }});

  const recommendModel = 'gpt-4o-mini';
  const data = await resp.json();
  console.log('open ai says:', data);
  if (!data?.data) return [];
  const models = data.data.map(m => m.id)
    .sort((a, b) => {
      if (a == recommendModel) return -1;
      if (b == recommendModel) return 1;

      const [a4o, b4o] = [
        a.indexOf('4o') != -1,
        b.indexOf('4o') != -1,
      ];

      if (a4o && !b4o) return -1;
      if (!a4o && b4o) return 1;

      const [ma, mb] = [
        a.match(/gpt-([0-9]+)/),
        b.match(/gpt-([0-9]+)/)];

      if (ma && !mb) return -1;
      if (!ma && mb) return 1;
      if (!ma && !mb) return b.localeCompare(a);
      return parseInt(mb[1]) - parseInt(ma[1]);
    });
  return models;
}
