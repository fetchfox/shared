import React, { useState, useEffect, useRef } from 'react';
import { Loading } from './Loading';
import { primaryColor } from '../../constants';

export const Button = (props) => {
  const [width, setWidth] = useState(null);
  return <div>BUTTON</div>;

  // const buttonRef = useRef(null);

  // useEffect(() => {
  //   if (buttonRef.current) {
  //     setWidth(buttonRef.current.offsetWidth);
  //   }
  // }, [props.loading]);

  // const extraStyles = {};
  // if (props.loading) {
  //   extraStyles.width = width;
  //   extraStyles.opacity = 1;
  //   extraStyles.cursor = 'default';
  // }

  // return (
  //   <button
  //     ref={buttonRef}
  //     style={extraStyles}
  //     {...props}>

  //     {!props.loading && props.children}
  //     {props.loading && (
  //       <div style={{ marginTop: 1 }}>
  //       <Loading
  //       size={(props?.className || '').indexOf('bt-sm') == -1 ? 18 : 14}
  //       color={(props?.className || '').indexOf('outline') == -1 ? 'white' : primaryColor}
  //       />
  //       </div>)
  //      }
  //   </button>
  // );
}