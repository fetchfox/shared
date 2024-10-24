import React, { Component } from 'react';
export const Error = ({
  message,
  small
}) => {
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: small ? '' : '2px solid red',
      background: small ? '' : '#ff000022',
      padding: small ? null : 10,
      color: 'red',
      fontWeight: 'bold',
      borderRadius: 4
    }
  }, message);
};
//# sourceMappingURL=Error.js.map