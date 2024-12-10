import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTab } from '../../hooks/userTab';

const Review = ({ review, reviewType }) => {
  const nav = useNavigate();
  const { activeTab, setActiveTab } = useTab();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`fa fa-star${i <= rating ? ' checked' : ''}`}
          style={{ color: i <= rating ? 'gold' : 'gray' }}
        ></span>
      );
    }
    return stars;
  };

  return (
    <div className='row align-items-center my-3'>
      <div
        className='col-auto'
        onClick={() =>
          nav(
            reviewType || activeTab == 'product-review'
              ? `/products/${review.id}`
              : `/profile/${review.id}`
          )
        }
      >
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
        <p className='mt-3 text-start'>{review.content}</p>
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
  reviewType: PropTypes.bool,
};

export default Review;
