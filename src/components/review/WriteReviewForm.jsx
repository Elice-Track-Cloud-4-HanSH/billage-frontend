import { useState } from 'react';
import PropTypes from 'prop-types';

const WriteReviewForm = ({ onSubmit }) => {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score === 0 || content.trim() === '') {
      alert('별점과 리뷰를 모두 입력해주세요.');
      return;
    }
    onSubmit({ score, content });
  };

  return (
    <form onSubmit={handleSubmit} className='write-review-form'>
      <div className='rating'>
        <label>별점:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleScoreChange(star)}
            style={{
              cursor: 'pointer',
              color: star <= score ? 'gold' : 'gray',
              fontSize: '24px',
            }}
          >
            ★
          </span>
        ))}
      </div>
      <div className='textarea'>
        <label htmlFor='review'>리뷰:</label>
        <textarea
          id='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='리뷰를 작성해주세요'
          rows='5'
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <button type='submit' style={{ marginTop: '10px' }}>
        제출하기
      </button>
    </form>
  );
};

WriteReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default WriteReviewForm;
