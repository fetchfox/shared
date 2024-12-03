import React, { useState, useEffect, useRef } from 'react';
import { useFetchCheck } from '../../state/fetch';
import { Loading } from '../common/Loading';
import { MdError } from 'react-icons/md';
import { IoWarning } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { installUrl } from '../../constants'

const Result = ({ url, rating, html }) => {
  const ranges = [
    [
      0,
      'FetchFox is blocked by ',
      <div style={{ color: '#E74C3C' }}>
        <MdError size={16} />
      </div>,
    ],
    [
      40,
      'FetchFox may be able to access ',
      <div style={{ color: '#F1C40F' }}>
        <IoWarning size={16} />
      </div>,
    ],
    [
      70,
      'FetchFox able to access ',
      <div style={{ color: '#27AE60' }}>
        <FaCheckCircle size={16} />
      </div>,
    ],
  ];

  let desc;
  let icon;
  for (const [min, d, i] of ranges) {
    if (rating >= min) {
      desc = d;
      icon = i;
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <div style={{ whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      gap: 5 }}>
          <div style={{ position: 'relative', top: 2 }}>{icon}</div>
          <div style={{ width: '100%' }}>
            <div style={{ textOverflow: 'ellipsis' }}>{desc} <b>{url}</b></div>
            {rating < ranges[2][0] && <div>
             If you encounter issues with this scrape, try the <b><a href={installUrl} target="_blank">Chrome Extension</a></b>
             </div>}
          </div>
        </div>
        <div><a href={html} target="_blank" style={{ display: 'flex', alignItems: 'center', color: '#aaa' }}><FaExternalLinkAlt /></a></div>
      </div>
    </div>
  );
}

export const FetchCheck = ({ url }) => {
  const [ok, setOk] = useState();
  const [best, setBest] = useState();
  const { result, loading } = useFetchCheck(url);

  useEffect(() => {
    if (loading) return;
    if (!result) return;

    const keys = Object.keys(result.result);
    let b = { rating: 0, html: '' };
    for (const key of keys) {
      const { rating, html } = result.result[key];
      if (rating > b.rating) {
        b = { rating, html };
      }
    }
    setBest(b);
  }, [result, loading]);

  return (
    <div>
      {loading && <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Loading size={16}><div>Checking access to <b>{url}</b>...</div></Loading></div>}
      {!loading && best && <Result url={url} rating={best.rating} html={best.html} />}

      {/*
      FetchCheck {url}
      <br/>
      <br/>
      {loading && <Loading />}
      <br/>
      <br/>
      {JSON.stringify(best)}
      <br/>
      <br/>
      {JSON.stringify(result)}
      <br/>
      <br/>
      */}
    </div>
  )
}
