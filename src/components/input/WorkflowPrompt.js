import React, { useState, useEffect } from 'react';
import { Loading } from '../common/Loading';
import { Input } from '../input/Input';
import { Textarea } from '../input/Textarea';
import { Button } from '../input/Button';
import { FaArrowRight } from 'react-icons/fa';
import { useGlobalContext }  from '@/src/contexts/index.js';

const UrlsInput = ({ value, onChange}) => {
  return (
    <Input
      label="Enter URL to scrape"
      style={{ width: '100%' }}
      value={value}
      onChange={onChange}
      placeholder="Enter URL to scrape, eg. https://example.com/page"
    />
  );
}

export const WorkflowPrompt = ({ values, onChange, onWorkflow }) => {
  const { fox } = useGlobalContext();
  const [loading, setLoading] = useState();
  const [disabled, setDisabled] = useState();

  console.log('WorkflowPrompt fox', fox);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (disabled) return;
    setLoading(true);
    setDisabled(true);

    // stuff
    console.log('preview via fox 2', fox);
    const p = await fox.plan(`${values.urls} ${values.prompt}`);
    console.log('p', p);

    setLoading(false);
    setDisabled(false);

    onWorkflow(p);
  };

  // const handleKeyDown = (e) => {
  //   if (e.key == 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSubmit(e);
  //   } else {
  //     console.log('handleKeyDown call onchange', e.target.value);
  //     onChange(e);
  //   }
  // }

  return (
    <div
      style={{ width: '100%',
               display: 'flex',
               flexDirection: 'column',
               gap: 10
             }}>
      <UrlsInput
        value={values.urls}
        onChange={(e) => onChange({ ...values, urls: e.target.value })}
      />

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative',
                      width: '100%',
                      marginTop: 8,
                      opacity: loading ? 0.5 : 1,
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
              loading={loading}
              disabled={loading || disabled}
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
                     borderRadius: 18,
                     minHeight: 80,
                   }}
            type="text"
            value={values.prompt}
            onChange={(e) => onChange({ ...values, prompt: e.target.value })}
            placeholder={'Example: "Look for links to articles, and on each article page, find the author, the publication date, and summarize it in 2-10 words."'}
          />
        </div>
      </form>
    </div>
  );
}
