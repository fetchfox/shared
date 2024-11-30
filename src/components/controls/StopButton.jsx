import { FaStop } from 'react-icons/fa';
import { useGlobalContext } from '../../contexts/index.js';
import { Button } from '../input/Button';

export const StopButton = ({ jobId, onStop, ...rest }) => {
  const { fox } = useGlobalContext();

  const stop = async () => {
    fox.stop(jobId);
    onStop && onStop();
  };

  return (
    <Button {...rest} onClick={stop}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', top: 2 }}>
          <FaStop size={16} />
        </div>
        <div>Stop</div>
      </div>
    </Button>
  );
};
