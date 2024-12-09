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
    <form onSubmit={handleSubmit} className='container p-4'>
      <div className='mb-4'>
        <label className='form-label fs-5'>별점</label>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleScoreChange(star)}
              style={{
                cursor: 'pointer',
                color: star <= score ? 'gold' : 'gray',
                fontSize: '36px',
              }}
              className='me-2'
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className='mb-4'>
        <textarea
          id='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='리뷰를 작성해주세요'
          rows='5'
          className='form-control'
        />
      </div>

      <div className='text-end'>
        <button type='submit' className='btn btn-lg' style={{ backgroundColor: '#6366F1' }}>
          제출하기
        </button>
      </div>
    </form>
  );
};

WriteReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default WriteReviewForm;
