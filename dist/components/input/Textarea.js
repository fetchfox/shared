function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from 'react';
import Textarea_ from 'react-expanding-textarea';
export const Textarea = props => {
  return /*#__PURE__*/React.createElement("div", null, props.label && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left',
      fontSize: 14,
      fontWeight: 'bold',
      color: '#555'
    }
  }, props.label), /*#__PURE__*/React.createElement(Textarea_, _extends({}, props, {
    style: {
      border: '1px solid #ccc',
      padding: '6px 10px',
      borderRadius: 6,
      boxShadow: '2px 2px #0001',
      fontSize: 14,
      ...props.style
    }
  })));
};
//# sourceMappingURL=Textarea.js.map