import React, { useState, useEffect, useRef } from 'react';
import { MdEdit } from 'react-icons/md';
import { Loading } from '../common/Loading';
import { Input } from '../input/Input';
import { Textarea } from '../input/Textarea';
import { Button } from '../input/Button';
import { Error } from '../error/Error';
import { FaArrowRight } from 'react-icons/fa';
import { useGlobalContext }  from '../../contexts/index.js';
import { cleanWorkflow } from '../../lib/workflow.js';
import { Workflow } from '../workflow/Workflow.jsx';
import { FaCode } from 'react-icons/fa';

const UrlsInput = ({ currentUrl, value, onChange, disabled }) => {
  const [didInit, setDidInit] = useState();
  const [editing, setEditing] = useState();
  const inputRef = useRef(null);

  useEffect(() => {
    if (didInit) return;
    setEditing(!currentUrl);
    setTimeout(
      () => setDidInit(true),
      50);
  }, [currentUrl]);

  useEffect(() => {
    if (!currentUrl) return;
    if (editing) return;
    if (value == currentUrl) return;

    onChange(currentUrl);
  }, [currentUrl, editing]);


  useEffect(() => {
    if (!didInit) return;
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
                   wordBreak: 'break-all',
                   overflowWrap: 'break-all',
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
      tabIndex="1"
      ref={inputRef}
      style={{ width: 'calc(100% - 8px)',
               boxShadow: 'unset',
               border: 0,
               background: 'white',
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
  baseWorkflow,
  values,
  preview,
  onlyPreview,
  onChange,
  onWorkflow,
  autoStart,
  overrideControls,
}) => {
  const { fox } = useGlobalContext();
  const [loading, setLoading] = useState({});
  const [disabled, setDisabled] = useState();
  const [editing, setEditing] = useState();
  const [workflow, setWorkflow] = useState(baseWorkflow);
  const [didAutoStart, setDidAutoStart] = useState();
  const [editCode, setEditCode] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState();

  useEffect(() => {
    if (didAutoStart) return;
    if (!autoStart) return;
    if (!fox) return;
    handlePreview();
    setDidAutoStart(true);
  }, [autoStart]);

  const handleContinue = async () => {
    console.log('continue', workflow);

    setLoading({ 'continue': true });
    let data;
    if (!workflow.name) {
      console.log('call describe');
      data = (await fox.load(workflow).describe()).dump();
    } else {
      data = workflow;
    }

    console.log('using data:', data);

    onWorkflow(data);
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
    e && e.preventDefault();
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
    await wf.describe();
    console.log('wf:', wf);

    const clean = cleanWorkflow(wf);
    setLoading({});

    if (preview) {
      setWorkflow(clean);
    } else {
      onWorkflow(clean);
    }
  };

  const handleCode = async () => {
    setCodeError(null);
    console.log('handlecode', code);

    let data;
    try {
      data = JSON.parse(code);
    } catch(e) {
      setCodeError(`Invalid scraper JSON ${e}`);
      return;
    }

    console.log('DATA', data)
    console.log('fox', fox)

    setLoading({ code: true });
    const wf = await fox.load(data).describe();
    setLoading({});

    console.log('code wf', wf);
    console.log('code wf dump', wf.dump());


    if (preview) {
      setWorkflow(wf.dump());
    } else {
      onWorkflow(wf.dump());
    }
  }

  let controlsNode;
  if (overrideControls) {
    controlsNode = overrideControls;
  } else {
    controlsNode = (
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
          disabled={editing || loading?.continue}
          >
          {editing ? 'Editing...' : 'Continue'}
        </Button>
      </div>
    );
  }

  const borderRadius = 10;

  const formNode = (
    <form
      style={{ display: 'flex',
               flexDirection: 'column',
               gap: 5,
               background: '#ddd',
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
                      zIndex: 10,
                    }}>
          {!disabled && <Button
           tabIndex="3"
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
           </Button>}
        </div>

        <Textarea
          tabIndex="2"
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
                   position: 'relative',
                   top: 4,
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
  );

  const codeNode = (
    <div style={{ background: '#ddd', borderRadius, padding: 10 }}>
      <div><b>JSON Scraper Definition</b></div>
      <div style={{ lineHeight: '20px' }}>Create a scraper using a JSON definition. For more information, see <a href="https://github.com/fetchfox/fetchfox">https://github.com/fetchfox/fetchfox</a></div>
      <textarea
        style={{ width: '100%',
                 height: 200,
                 border: '1px solid #ccc',
                 borderRadius: 5,
                 marginTop: 15,
               }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Error small message={codeError} />

      {!workflow && <Button loading={loading.code} onClick={handleCode} style={{ width: '100%', marginTop: 15}}>
        Continue
      </Button>}
    </div>
  );

  const continueNode = (
    <div style={{ position: 'sticky',
                  bottom: 0,
                  left: 0,
                  background: 'white',
                  width: 'calc(100% + 2px)',
                  maxWidth: '100vw',
                  padding: '10px 0',
                  marginTop: 40,
                }}>
      {controlsNode}
    </div>
  );
  
  return (
    <div style={{ width: '100%' }}>
      {/*
      <p>currentHtml:{(currentHtml || 'NONE').substr(0, 100)}</p>
      */}

      {!onlyPreview && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <FaCode
          style={{ cursor: 'pointer' }}
          color={editCode ? '#333' : '#aaa'}
          size={16}
          onClick={() => setEditCode(!editCode)}
        />
      </div>}

      {!onlyPreview && editCode && codeNode}
      {!onlyPreview && !editCode && formNode}

      <div style={{ marginTop: 20 }}>
        {loading.preview && <p style={{ textAlign: 'center' }}>
          The AI is generating your scrape plan. This may take a few moments...<br/>
          <br/>
          <Loading />
         </p>}

         {workflow && <p style={{ textAlign: 'center' }}>
          Review and edit the scrape plan below
          </p>}
          {workflow && (
            <Workflow
            editable
            workflow={workflow}
            onChange={setWorkflow}
            onEditing={setEditing}
            />
          )}
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
