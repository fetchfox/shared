import React, { useState, useEffect, useRef } from 'react';
import { Loading } from '../common/Loading.js';
import { primaryColor } from '../../constants.js';
import { Tooltip } from 'react-tooltip';
import styles from './Button.module.css';
// import './Button.css';

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

  let className = styles.Button;
  if (props.className) {
    className += ' ' + props.className;
  }

  if (props.simple) {
    className += ' ' + styles.ButtonSimple;
  }
  if (props.small) {
    className += ' ' + styles.ButtonSmall;
  }
  if (props.large) {
    className += ' ' + styles.ButtonLarge;
  }
  if (props.gray) {
    className += ' ' + styles.ButtonGray;
  }
  if (props.black) {
    className += ' ' + styles.ButtonBlack;
  }
  if (props.white) {
    className += ' ' + styles.ButtonWhite;
  }
  if (props.outline) {
    className += ' ' + styles.ButtonOutline;
  }
  if (props.trans) {
    className += ' Trans ' + styles.ButtonTrans;
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
