import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button.js';
import { ByokInput } from './ByokInput.js';
import { primaryColor } from '../../constants.js';
import { useIfSmall } from '../../state/responsive.js';

const Choice = ({
  title,
  subtitle,
  description,
  button,
  loading,
  children,
  onClick,
  disabled,
  active,
}) => {
  return (
    <div
      style={{ padding: 20,
               marginBottom: 20,
               borderRadius: 4,
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
               gap: 10,
               ...(active ? {
                 boxShadowx: `2px 2px #ddd`,
                 border: '1px solid ' + primaryColor,
                 background: 'white',
                 padding: 18,
               } : {}),
             }}
      >
      <div>
        <div stylex={{ fontSize: 18,
                      fontWeight: 'bold',
                      color: '#444',
                      fontVariantCaps: 'small-caps',
                    }}>
          {subtitle}
        </div>
        <div stylex={{ fontSize: 24,
                      color: '#999',
                    }}>
          {title}
        </div>
      </div>
      <div stylex={{ fontSize: 14 }}>
        {description}
      </div>
      {children}
      <div style={{ flexGrow: 1 }}></div>
      <Button
        large
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        >
        {button}
      </Button>
    </div>
  );
}


export const ApiSettingsInput = ({ settings, onSettingsChange }) => {
  const [loading, setLoading] = useState({});
  const [byokOk, setByokOk] = useState();
  const { ifMatch: ifSmall } = useIfSmall();

  useEffect(() => {
    if (!settings?.byok?.provider) {
      setByokOk(false);
      return;
    }

    const p = settings.byok[settings.byok.provider];
    if (!p?.apiKey || !p?.model) {
      setByokOk(false);
      return;
    }
    setByokOk(true);
  }, [settings?.byok]);

  const setLoadingChoice = (choice, val) => {
    const loadingCopy = { ...loading };
    loadingCopy[choice] = val;
    setLoading(loadingCopy);
  }

  const choose = async (choice) => {
    console.log('choose', choice);
    setLoadingChoice(choice, true);

    const copy = { ...settings };
    if (!copy.ai) {
      copy.ai = {};
    }
    if (choice == 'fetchfoxServer') {
      copy.mode = 'server';
      copy.ai.provider = 'fetchfox';
      if (!copy.fetchfox) {
        copy.fetchfox = {};
      }
      if (!copy.fetchfox.apiKey) {
        const { key } = await generateApiKey();
        console.log('apiKey', key);
        copy.fetchfox.apiKey = key;
      }

    } else if (choice == 'byok') {
      copy.mode = 'byok';
      if (!copy.byok) {
        copy.byok = {};
      }
    }

    // setSettings(copy);
    onSettingsChange(copy);
    setLoadingChoice(choice, false);

    // onDone(copy);
  }

  const handleByok = (val) => {
    const copy = { ...settings };
    if (!copy.byok) {
      copy.byok = {};
    }
    copy.byok = { ...copy.byok, ...val };
    // setSettings(copy);
    onSettingsChange(copy);
  }

  return (
    <div style={{ display: 'flex',
                  flexDirection: 'column',
                  background: '#f6f6f6',
                  borderRadius: 8,
                  padding: 20,
                }}>
      <div style={{}}>
        <Choice
          title="Use FetchFox Server"
          subtitle="FetchFox AI Server"
          button="Use FetchFox Server"
          onClick={() => choose('fetchfoxServer')}
          loading={loading.fetchfoxServer}
          active={settings.mode == 'server'}
          >
          <div>
            Use FetchFox's servers as your AI provider. FetchFox will select which AI model to use and manage token usage and cost.
          </div>
        </Choice>
      </div>
      <div>
        <Choice
          title="Choose Your AI"
          subtitle="Bring Your Own Key"
          button="Use My API Key"
          onClick={() => choose('byok')}
          loading={loading.byok}
          disabled={!byokOk}
          active={settings.mode == 'byok'}
          >
          <div>
            Use a specific AI provider and model that you pick. You will incur costs from the AI provider, and you will receive bonus free extractions on FetchFox.
          </div>
          <ByokInput
            value={settings?.byok || {}}
            onChange={handleByok}
          />
        </Choice>
      </div>
    </div>
  );
}
