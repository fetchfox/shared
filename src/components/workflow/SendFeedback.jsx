import React, { useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { endpoint } from '../../api';
import { Button } from '../input/Button';
import { Textarea } from '../input/Textarea';

const ratingOptions = [
  {
    icon: FaThumbsUp,
    style: {
      color: '#15803d',
      background: '#86efac',
      borderColor: '#15803d',
    },
    value: 'up',
  },
  {
    icon: FaThumbsDown,
    style: {
      color: '#b91c1c',
      background: '#fca5a5',
      borderColor: '#b91c1c',
    },
    value: 'down',
  },
];

export function SendFeedback({ meta }) {
  const [rating, setRating] = useState(null); // 'up' | 'down' | null
  const [feedback, setFeedback] = useState('');

  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    setSent(true);
    await callApi('POST', '/api/v2/feedback', { rating, feedback, meta });
  };

  // once we've submitted, hide the feedback form
  if (sent) return null;

  return (
    <div
      style={{
        padding: 10,
        background: '#fef9c350',
        border: '1px solid #ccc',
        boxShadow: '2px 2px #eee',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        How were these results?
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {ratingOptions.map(({ icon: Icon, style, value }) => (
          <div
            style={{
              borderRadius: '9999px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderWidth: 2,
              borderStyle: 'solid',
              ...style,
              ...(value === rating ? { opacity: '100%' } : { opacity: '50%', borderColor: 'transparent' }),
            }}
            onClick={() => setRating(value)}
          >
            <Icon />
          </div>
        ))}
      </div>
      {rating && (
        <div>
          <Textarea
            tabIndex="2"
            style={{
              width: '100%',
              fontFamily: 'sans-serif',
              fontSize: 13,
              resize: 'none',
              padding: 8,
              marginTop: 8,
              marginBottom: 4,
              borderRadius: 4,
              boxShadow: 'unset',
            }}
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any additional feedback?"
          />
          <Button small style={{ width: '100%' }} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}

      {/* <pre>{JSON.stringify(steps, null, 2)}</pre> */}
    </div>
  );
}
