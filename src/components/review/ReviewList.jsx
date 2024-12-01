import Review from './Review';
import PropTypes from 'prop-types';

const ReviewList = ({ reviews }) => {
  return (
    <div>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className='mb-3'>
            <Review review={review} />
          </div>
        ))
      ) : (
        <p>리뷰가 없습니다.</p>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ReviewList;
