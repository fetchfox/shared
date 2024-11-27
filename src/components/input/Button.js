import React, { useState, useEffect, useRef } from 'react';
import { Loading } from '../common/Loading.js';
import { primaryColor } from '../../constants.js';
import { Tooltip } from 'react-tooltip';
import styles from './Button.module.css';

export const Button = (props) => {
  const [width, setWidth] = useState(null);
  const [width_, setWidth_] = useState(null);
  const buttonRef = useRef(null);

  const {
    href,
    simple,
    small,
    large,
    gray,
    black,
    white,
    outline,
    trans,
    loading,
    disabled,
    ...rest
  } = props;

  useEffect(() => {
    if (!loading && buttonRef?.current?.offsetWidth) {
      setWidth_(buttonRef?.current?.offsetWidth);
    }
  }, [buttonRef?.current?.offsetWidth]);

  // useEffect(() => {
  //   if (buttonRef.current) {
  //     setWidth(buttonRef.current.offsetWidth);
  //   }
  // }, [loading]);

  const extraStyles = {};
  if (loading) {
    extraStyles.width = width_;
    extraStyles.opacity = 1;
    extraStyles.cursor = 'default';
  }

  let className = styles.Button;

  if (rest.className) {
    delete rest.className;
    className += ' ' + className;
  }

  if (simple) {
    className += ' ' + styles.ButtonSimple;
  }
  if (small) {
    className += ' ' + styles.ButtonSmall;
  }
  if (large) {
    className += ' ' + styles.ButtonLarge;
  }
  if (gray) {
    className += ' ' + styles.ButtonGray;
  }
  if (black) {
    className += ' ' + styles.ButtonBlack;
  }
  if (white) {
    className += ' ' + styles.ButtonWhite;
  }
  if (outline) {
    className += ' ' + styles.ButtonOutline;
  }
  if (trans) {
    className += ' ' + styles.ButtonTrans;
  }

  let body = (
    <button
      ref={buttonRef}
      style={extraStyles}
      {...rest}
      className={className}
      data-tooltip-id="tooltip1"
      data-tooltip-content={props.tooltip}
      disabled={!!props.disabled}
      >

      {!props.loading && props.children}
      {props.loading && (
        <div style={{ position: 'relative', top: 2 }}>
        <Loading
        size={props.small ? 14 : 18}
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

  if (href) {
    body = <a href={href} style={{ textDecoration: 'none', ...rest.style }}>{body}</a>;
  }

  return body;
}
