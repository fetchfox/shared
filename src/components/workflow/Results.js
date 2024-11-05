import React, { useState, useEffect, useRef } from 'react';
import { FaArrowAltCircleDown, FaDotCircle, FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { Loading } from '../common/Loading';
import { Error } from '../error/Error';
import { TableFromItems } from '../table/TableFromItems';
import { primaryColor } from '../../constants';

const prettyName = (name) => {
  const n = {
    const: 'Starting URLs',
    crawl: 'Find more URLs',
    extract: 'Extract data',
  }[name];

  if (n) return n;

  return name.upperFirst()
}

const ItemsResult = ({ items }) => (
  <div>
    <TableFromItems
      items={items} />
  </div>
);

const CrawlResult = ({ items }) => (
  <div>
    <TableFromItems items={items.map(i => ({ url: i.url }))} />
  </div>
);

const ResultHeader = ({ index, result }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 24 }}>
      <div style={{ marginTop: 5 }}>
        {result.loading && <Loading size={16} />}
        {result.done && !result.forcedDone && !result.error && <FaCheckCircle size={16} color="green" />}
        {result.forcedDone && !result.error && (
          <div>
          <FaDotCircle
          size={16}
          color="#ffc107"
          data-tooltip-id={`forcedDone-${index}`}
          data-tooltip-content="Stopped before completion"
          
          />
          <Tooltip id={`forcedDone-${index}`} place="bottom-end" />
          </div>
         )}
        {result.done && result.error && <MdError size={16} color="red" />}
      </div>
      <div>
        {prettyName(result.step.name)}
      </div>
    </div>
  );
}

export const Result = ({ index, result, last }) => {
  const { step, items } = result;
  if (!items) return null;

  const prettyName = <ResultHeader index={index} result={result} />;

  let node = {
    'crawl': <CrawlResult items={items} />,
  }[step.name];

  if (!node) {
    node = <ItemsResult items={items} />;
  }

  let errorNode;
  if (result.error) {
    errorNode = <Error small message={result.error} />;
  }
  const borderRadius = 4;
  let borderStyles;
  let className;

  // TODO: Fix ants!!
  if (false && result.loading) {
    className = 'ants';
    borderStyles = {
      padding: 9,
      borderRadius,
    };
  } else {
    className = '';
    borderStyles = {
      padding: 10,
      background: 'white',
      border: '1px solid #ccc',
      boxShadow: `2px 2px #eee`,
      borderRadius,
    };
  }

  return (
    <div>
      <style type="text/css">{`
.ants {
	border: 2px solid rgba(0,0,0,0);
  border-radius: 8px;
	background-image:
    linear-gradient(#fff, #fff),
    repeating-linear-gradient(
      -45deg,
      var(--ants-light) 0,
      var(--ants-dark) 12.5%,
      var(--ants-light) 25%,
      var(--ants-dark) 37.5%,
      var(--ants-light) 50%);
	background-clip: padding-box, border-box;
	background-size: 3em 3em;
	box-sizing: border-box;
	padding: 1em;
	animation: ants 20s linear infinite;
}

@keyframes ants {
	to { background-position: 100% 100%; }
}
`}
      </style>

      <div
        className={className}
        style={{ fontSize: 14,
                 ...borderStyles,
               }}>
        <div style={{ display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 5,
                    }}
          >
          {prettyName}
        </div>
        {node}
        {errorNode}
      </div>


      {!last && (
        <div style={{ padding: 10,
                      width: '100%',
                      textAlign: 'center',
                      color: primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
        }}>
        <FaArrowAltCircleDown size={24} />
        </div>
       )}
    </div>
  );
}

export const Results = ({ results }) => {
  // const resultsWithItems = results.filter(x => x.items && x.items.length > 0);
  const resultsWithItems = results;

  let i = 0;
  const nodes = (resultsWithItems || []).map(result => (
    <Result
      key={i}
      index={i}
      last={++i == resultsWithItems.length}
      result={result}
    />
  ));

  return (
    <div>
      {nodes}

      {/*
      <pre className="dense">{JSON.stringify(results, null, 2)}</pre>
      */}
    </div>
  );
}
