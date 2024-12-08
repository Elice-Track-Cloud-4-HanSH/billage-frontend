import PropTypes from 'prop-types';

const Review = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`fa fa-star${i <= rating ? ' checked' : ''}`}></span>);
    }
    return stars;
  };

  return (
    <div className='row align-items-center my-3'>
      <div className='col-auto'>
        <img
          src={review.imageUrl}
          alt='이미지'
          className='img-fluid rounded'
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
      </div>
      <div className='col'>
        <div className='d-flex justify-content-between align-items-center'>
          <h5>{review.subject}</h5>
          <div>{renderStars(review.score)}</div>
        </div>
        <p className='mt-3'>{review.content}</p>
      </div>
    </div>
  );
};

Review.propTypes = {
  review: PropTypes.shape({
    reviewId: PropTypes.number,
    id: PropTypes.number,
    imageUrl: PropTypes.string,
    subject: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Review;
