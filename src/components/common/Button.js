import React, { useState, useEffect, useRef } from 'react';
import { Loading } from './Loading.js';
import { primaryColor } from '../../constants.js';
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

  return (
    <button
      ref={buttonRef}
      style={extraStyles}
      {...props}
      className={className}
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
    </button>
  );
}
