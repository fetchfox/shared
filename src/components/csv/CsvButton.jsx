import React, { useState, useEffect, useRef } from 'react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { FaStopCircle, FaFileDownload } from 'react-icons/fa';
import { Button } from '../input/Button';
import { useJob } from '../../state/job';
import { Loading } from '../common/Loading';
import { useGlobalContext } from '../../contexts';
import { primaryColor } from '../../constants';

const downloadCSV = (items) => {
  const filename = 'fetchfox';
  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename });

  const allStrings = [];
  for (const item of items) {
    const copy = {};
    for (const key of Object.keys(item)) {
      let val = item[key];

      const skip = (
        item._meta?.status == 'loading' ||
        item._meta?.status == 'error');
      if (skip) continue;

      if (typeof val != 'string') {
        val = JSON.stringify(val);
      }
      copy[key] = val;
    }
    allStrings.push(copy);
  }

  const csv = generateCsv(csvConfig)(allStrings);
  download(csvConfig)(csv);
};

export const CsvButton = ({ jobId, onStop, items, ...rest }) => {
  const { fox } = useGlobalContext();
  const results = useJob(jobId);
  const [stopping, setStopping] = useState();
  const [stopped, setStopped] = useState();
  const [items_, setItems_] = useState([]);

  useEffect(() => {
    if (jobId) {
      setItems_(results?.items || []);
      return;
    }
    if (Array.isArray(items)) {
      setItems_(items);
    }
  }, [results?.items, items]);

  useEffect(() => {
    setStopping(false);
  }, [jobId]);

  const stop = async () => {
    fox.stop(jobId);
    setStopping(true);
    onStop && onStop();
  };

  const controlsNode = (
    <div style={{ display: 'flex', gap: 8 }}>
      {!stopping && results && !results.done && <Loading size={32} />}
      {!stopping && results && !results.done && (
        <Button trans black tooltip="Stop" onClick={stop}>
          <FaStopCircle size={32} />
        </Button>
      )}
      {stopping && <Loading>Stopping..</Loading>}
    </div>
  );

  if (rest.children) {
    return <div onClick={() => downloadCSV(items_)}>{rest.children}</div>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      {/*jobId && results && !results.done && controlsNode*/}
      {results && jobId && items_.length == 0 && !results?.done && <Loading>Waiting for results...</Loading>}
      {items_.length > 0 && (
        <Button
          outline={results?.done}
          style={{ width: '100%', display: 'flex', gap: 8, whiteSpace: 'nowrap', alignItems: 'center' }}
          onClick={() => downloadCSV(items_)}
          {...rest}
        >
          {results?.done ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaFileDownload size={14} />
              Download CSV ({items_.length})
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loading size={18} color={primaryColor} />
              Partial CSV ({items_.length})
            </div>
          )}
        </Button>
      )}
    </div>
  );
};
