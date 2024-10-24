import React, { useState, useEffect } from 'react';
import { Loading } from '../common/Loading';
import { Input } from '../input/Input';
import { Textarea } from '../input/Textarea';
import { Button } from '../input/Button';
import { FaArrowRight } from 'react-icons/fa';
const UrlsInput = ({
  value,
  onChange
}) => {
  return /*#__PURE__*/React.createElement(Input, {
    label: "Enter URL to scrape",
    style: {
      width: '100%'
    },
    value: value,
    onChange: onChange,
    placeholder: "Enter URL to scrape, eg. https://example.com/page"
  });
};
export const WorkflowPrompt = ({
  fox,
  values,
  onChange,
  onWorkflow
}) => {
  const [loading, setLoading] = useState();
  const [disabled, setDisabled] = useState();
  const handleSubmit = async e => {
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

  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(UrlsInput, {
    value: values.urls,
    onChange: e => onChange({
      ...values,
      urls: e.target.value
    })
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      marginTop: 8,
      opacity: loading ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 2,
      bottom: 5
    }
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    style: {
      height: 30,
      width: 30,
      borderRadius: 15,
      padding: 0,
      boxShadow: 'unset'
    },
    loading: loading,
    disabled: loading || disabled
  }, /*#__PURE__*/React.createElement(FaArrowRight, {
    size: 14
  }))), /*#__PURE__*/React.createElement(Textarea, {
    style: {
      width: '100%',
      fontFamily: 'sans-serif',
      fontSize: 16,
      resize: 'none',
      padding: 8,
      paddingLeft: 12,
      paddingRight: 36,
      borderRadius: 18,
      minHeight: 80
    },
    type: "text",
    value: values.prompt,
    onChange: e => onChange({
      ...values,
      prompt: e.target.value
    }),
    placeholder: 'Example: "Look for links to articles, and on each article page, find the author, the publication date, and summarize it in 2-10 words."'
  }))));
};
//# sourceMappingURL=WorkflowPrompt.js.map