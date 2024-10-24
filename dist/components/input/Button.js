function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect, useRef } from 'react';
import { Loading } from "../common/Loading.js";
import { primaryColor } from "../../constants.js";
import "./Button.css";
export const Button = props => {
  const [width, setWidth] = useState(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  }, [props.loading]);
  const extraStyles = {};
  if (props.loading) {
    extraStyles.width = width;
    extraStyles.opacity = 1;
    extraStyles.cursor = 'default';
  }
  const className = 'Button';
  if (props.small) {
    className += ' Button-small';
  }
  if (props.large) {
    className += ' Button-large';
  }
  if (props.gray) {
    className += ' Button-gray';
  }
  if (props.white) {
    className += ' Button-white';
  }
  if (props.outline) {
    className += ' Button-outline';
  }
  if (props.trans) {
    className += ' Button-trans';
  }
  const buttonProps = {
    ...props
  };
  delete buttonProps.loading;
  return /*#__PURE__*/React.createElement("button", _extends({
    ref: buttonRef,
    style: extraStyles
  }, props, {
    className: className
  }), !props.loading && props.children, props.loading && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Loading, {
    size: props.small ? 18 : 14,
    color: "white"
  })));
};
//# sourceMappingURL=Button.js.map