import React, { useState, useEffect, useRef } from 'react';
import { MdEdit } from 'react-icons/md';
import { Loading } from '../common/Loading';
import { Input } from '../input/Input';
import { Textarea } from '../input/Textarea';
import { Button } from '../input/Button';
import { FaArrowRight } from 'react-icons/fa';
import { useGlobalContext }  from '@/src/contexts/index.js';
import { cleanWorkflow } from '@/src/lib/workflow.js';
import { Workflow } from '@/src/components/workflow/Workflow.js';

const UrlsInput = ({ currentUrl, value, onChange, disabled }) => {
  const [editing, setEditing] = useState();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!currentUrl) return;
    if (editing) return;
    if (value == currentUrl) return;
    onChange(currentUrl);
  }, [currentUrl, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select();
    }
  }, [editing]);

  if (!editing) {
    return (
      <div
        style={{ display: 'flex',
                 alignItems: 'center',
                 color: '#555',
                 paddingTop: 10,
                 gap: 5,
               }}
        >
        <div
          style={{ marginLeft: 10,
                   fontWeight: 'bold',
                   fontSize: 12,
                 }}
          >
          {value}
        </div>
        <MdEdit
          size={14}
          style={{ cursor: 'pointer' }}
          onClick={() => setEditing(true)}
        />
      </div>
    );
  } else {
  }

  return (
    <Input
      ref={inputRef}
      style={{ width: 'calc(100% - 8px)',
               boxShadow: 'unset',
               border: 0,
               background: 'rgba(255,255,255,.5)',
               margin: 4,
             }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter URL to scrape, eg. https://example.com/page"
      disabled={disabled}
    />
  );
}

export const WorkflowPrompt = ({
  currentUrl,
  currentHtml,
  values,
  preview,
  onChange,
  onWorkflow,
}) => {
  const { fox } = useGlobalContext();
  const [loading, setLoading] = useState({});
  const [disabled, setDisabled] = useState();
  const [workflow, setWorkflow] = useState();

  const handleContinue = () => {
    onWorkflow(workflow);
  }

  const handleKeyDown = (e) => {
    const isMac = navigator.platform.toLowerCase().indexOf('mac') >= 0;
    if (e.ctrlKey && e.key == 'Enter' ||
        (isMac && e.metaKey && e.key == 'Enter')
    ) {
      handlePreview(e);
    }
  }

  const handlePreview = async (e) => {
    e.preventDefault();
    if (loading.preview) return;
    if (disabled) return;

    setWorkflow(null);
    setLoading({ preview: true });
    setDisabled(true);

    const url = values.urls;
    const html = url == currentUrl ? currentHtml : '';

    const wf = await fox.plan({
      prompt: values.prompt,
      url,
      html,
    });

    console.log('got wf', wf);

    const clean = cleanWorkflow(wf);
    setLoading({});
    setDisabled(false);

    console.log('got wf', wf);
    console.log('clean wf', clean);

    if (preview) {
      setWorkflow(clean);
    } else {
      onWorkflow(clean);
    }
  };

  const continueNode = (
    <div style={{ position: 'fixed',
                  bottom: 0,
                  left: 0,
                  background: '#f3f3f3',
                  width: '100vw',
                  padding: 10,
                }}>
      <div style={{ display: 'flex',
                    justifyContent: 'center',
                    gap: 10,
                    margin: '0 auto',
                  }}>
        <Button
          large outline
          style={{ width: '50%' }}
          onClick={() => { setWorkflow(); setDisabled(false) }}
          >
          Start Over
        </Button>
        <Button
          large
          style={{ width: '50%' }}
          onClick={handleContinue}
          loading={loading?.continue}
          >
          Continue
        </Button>
      </div>
    </div>
  );

  const borderRadius = 10;
  
  return (
    <div
      style={{ width: '100%' }}>

      {/*
      <p>currentHtml:{(currentHtml || 'NONE').substr(0, 100)}</p>
      */}

      <form
        style={{ display: 'flex',
                 flexDirection: 'column',
                 gap: 10,
                 background: '#ddd',
                 paddingTopx: 10,
                 borderRadius,
               }}
        onSubmit={handlePreview}
        >
        <UrlsInput
          currentUrl={currentUrl}
          value={values.urls}
          onChange={(val) => onChange({ ...values, urls: val })}
          disabled={disabled}
        />
        <div style={{ position: 'relative',
                      width: '100%',
                      marginTopx: 8,
                      opacity: loading.preview ? 0.5 : 1,
                    }}>
          <div style={{ position: 'absolute',
                        right: 2,
                        bottom: 5,
                      }}>
            <Button
              type="submit"
              style={{ height: 30,
                       width: 30,
                       borderRadius: 15,
                       padding: 0,
                       boxShadow: 'unset',
                     }}
              loading={loading.preview}
              disabled={disabled}
              >
              <FaArrowRight size={14} />
            </Button>
          </div>

          <Textarea
            style={{ width: '100%',
                     fontFamily: 'sans-serif',
                     fontSize: 16,
                     resize: 'none',
                     padding: 8,
                     paddingLeft: 12,
                     paddingRight: 36,
                     borderRadius,
                     minHeight: 80,
                     boxShadow: 'unset',
                   }}
            type="text"
            disabled={disabled}
            value={values.prompt}
            onChange={(e) => onChange({ ...values, prompt: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={'Example: "Look for links to articles, and on each article page, find the author, the publication date, and summarize it in 2-10 words."'}
          />
        </div>
      </form>

      <div style={{ marginTop: 20 }}>
        {loading.preview && <p style={{ textAlign: 'center' }}>
         The AI is generating your scrape plan. This may take a few moments...
         </p>}

         {workflow && <p style={{ textAlign: 'center' }}>
          Review and edit the AI generated scrape plan below
          </p>}
         {workflow && <Workflow workflow={workflow} editable />}
         {workflow && continueNode}
      </div>

      {/*
      <pre>
        {JSON.stringify(workflow, null, 2)}
      </pre>
      */}
    </div>
  );
}
