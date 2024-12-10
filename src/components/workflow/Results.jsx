import { useEffect, useState } from 'react';
import { FaArrowAltCircleDown, FaCheckCircle, FaDotCircle, FaFileDownload } from 'react-icons/fa';
import { FaExpand } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { PiArrowsInLineHorizontalBold, PiArrowsOutLineHorizontalBold } from 'react-icons/pi';
import { Tooltip } from 'react-tooltip';
import { primaryColor } from '../../constants';
import { useJob } from '../../state/job';
import { Loading } from '../common/Loading';
import { CsvButton } from '../csv/CsvButton';
import { Error } from '../error/Error';
import { Modal } from '../modal/Modal';
import { TableFromItems } from '../table/TableFromItems';
import { capitalize } from '@/src/utils';

const prettyName = (name) => {
  const predefinedLabels = {
    const: 'Starting URLs',
    crawl: 'Find more URLs',
    extract: 'Extract data',
  };
  return predefinedLabels[name] || capitalize(name);
};

const FullResult = ({ result }) => {
  const [showPrivate, setShowPrivate] = useState();

  let hasPrivate = false;
  for (const item of result.items || []) {
    for (const key of Object.keys(item)) {
      hasPrivate = hasPrivate || key.startsWith('_');
    }
  }

  return (
    <div style={{ fontWeight: 'normal' }}>
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {result.items.length} result{result.items.length == 1 ? '' : 's'}
        </div>

        {hasPrivate && showPrivate && (
          <PiArrowsInLineHorizontalBold
            size={20}
            onClick={() => setShowPrivate(!showPrivate)}
            style={{ cursor: 'pointer', color: '#333' }}
          />
        )}
        {hasPrivate && !showPrivate && (
          <PiArrowsOutLineHorizontalBold
            size={20}
            onClick={() => setShowPrivate(!showPrivate)}
            style={{ cursor: 'pointer', color: '#333' }}
          />
        )}
      </div>
      <TableFromItems
        noOverflow
        showPrivate={showPrivate}
        style={{ background: '#fff' }}
        allCellStyle={{ maxWidth: 600, padding: '2px 4px' }}
        items={result.items}
      />
    </div>
  );
};

const ItemsResult = ({ items }) => (
  <div>
    <TableFromItems
      style={{ background: '#fff' }}
      items={items}
      overflow={6}
      clipMiddle />
  </div>
);

const ConstResult = ({ items }) => (
  <div>
    <TableFromItems
      noHeader
      style={{ background: '#fff' }}
      items={items.map((i) => ({ url: i.url || i._url }))}
    />
  </div>
);

const CrawlResult = ({ items }) => (
  <div>
    <TableFromItems
      noHeader
      style={{ background: '#fff' }}
      items={items.map((i) => ({ url: i.url || i._url }))}
      overflow={6}
      clipMiddle
      showPrivate
    />
  </div>
);

const ResultHeader = ({ index, result }) => {
  const title = `Results for ${prettyName(result.step.name)}`;

  const count = (result.items || [])
    .filter(item => (
      !item._meta ||
      item._meta?.status == 'done'
    ))
    .length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 24, width: '100%' }}>
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
      <div style={{ width: '100%' }}>
        {title} ({count})
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <CsvButton items={result.items}>
          <FaFileDownload
            style={{ cursor: 'pointer', color: '#777' }}
            data-tooltip-id={`csv-${index}`}
            data-tooltip-content={`Download CSV of Step ${index + 1}`}
          />
        </CsvButton>

        <Modal title={title}>
          <FaExpand
            style={{ cursor: 'pointer', color: '#777' }}
            data-tooltip-id={`full-${index}`}
            data-tooltip-content={`Expand Step ${index + 1}`}
          />
          <FullResult result={result} />
        </Modal>

        <Tooltip id={`csv-${index}`} place="bottom-end" style={{ zIndex: 1000 }} />
        <Tooltip id={`full-${index}`} place="bottom-end" style={{ zIndex: 1000 }} />
      </div>
    </div>
  );
};

export const Result = ({ index, result, last, inner }) => {
  const { step, items } = result;
  if (!items) return null;

  const prettyName = false && inner ? null : <ResultHeader index={index} result={result} />;

  let node = {
    const: <ConstResult items={items} />,
    crawl: <CrawlResult items={items} />,
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
      backgroundx: 'white',
      border: '1px solid #ccc',
      boxShadow: `2px 2px #eee`,
      borderRadius,
      ...(inner
        ? {
            padding: 0,
            border: 0,
            boxShadow: 0,
          }
        : {}),
    };
  }

  return (
    <div>
      <style type="text/css">
        {`
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

      <div className={className} style={{ fontSize: 14, ...borderStyles }}>
        <div
          style={{
            display: 'flex',
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

      {!last && !inner && (
        <div
          style={{
            padding: 10,
            width: '100%',
            textAlign: 'center',
            color: primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaArrowAltCircleDown size={24} />
        </div>
      )}

      {/*
      RESULT JSON:
      <pre>{JSON.stringify(result, null, 2)}</pre>
      */}
    </div>
  );
};

const Inner = ({ results }) => {
  // const resultsWithItems = results.filter(x => x.items && x.items.length > 0);
  const resultsWithItems = results;

  let i = 0;
  const nodes = (resultsWithItems || []).map((result) => (
    <Result key={i} index={i} last={++i == resultsWithItems.length} result={result} />
  ));

  return (
    <div>
      {nodes}

      {/*
      <pre className="dense">{JSON.stringify(results, null, 2)}</pre>
      */}
    </div>
  );
};

export const Results = ({ jobId }) => {
  const [starting, setStarting] = useState();
  const results = useJob(jobId);

  useEffect(() => {
    if (!jobId) {
      setStarting(false);
      return;
    }
    if (jobId && (results?.full || []).length > 0) {
      setStarting(false);
      return;
    }

    setStarting(true);
  }, [jobId, results]);

  return (
    <div>
      {starting && <Loading>Starting your scraper...</Loading>}
      {results?.full && <Inner results={results.full} />}

      {/*
      RESULTS:
      <pre>{JSON.stringify(results, null, 2)}</pre>
      JOBID:{JSON.stringify(jobId)} <br />
      */}
    </div>
  );
};
