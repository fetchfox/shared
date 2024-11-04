import React, { useState, useEffect, useRef } from 'react';
import { Loading } from '@/src/components/common/Loading.js';
import { primaryColor } from '@/src/constants.js';
import { Tooltip } from 'react-tooltip';
import './Button.css';

export const Button = (props) => {
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

  let className = props.className === undefined ? 'Button' : 'Button ' + props.className;
  if (props.simple) {
    className += ' Button-simple';
  }
  if (props.small) {
    className += ' Button-small';
  }
  if (props.large) {
    className += ' Button-large';
  }
  if (props.gray) {
    className += ' Button-gray';
  }
  if (props.black) {
    className += ' Button-black';
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

  const buttonProps = {...props};
  delete buttonProps.loading;

  return (
    <button
      ref={buttonRef}
      style={extraStyles}
      {...props}
      className={className}
      data-tooltip-id="tooltip1"
      data-tooltip-content={props.tooltip}
      >

      {!props.loading && props.children}
      {props.loading && (
        <div style={{ marginTop: 1 }}>
        <Loading
        size={props.small ? 18 : 14}
        color="white"
        />
        </div>)
       }
        {props.tooltip && (
          <Tooltip
          id="tooltip1"
          place={props.tooltipPlace || "bottom"}
          />
         )}
    </button>
  );
}
