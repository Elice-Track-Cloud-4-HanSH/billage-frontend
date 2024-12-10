import Review from './Review';
import PropTypes from 'prop-types';
import { Card, Alert } from 'react-bootstrap';

const ReviewList = ({ reviews, reviewType }) => {
  return (
    <div className='container'>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <Card key={index} className='mb-4 pb-3 border-0 border-bottom'>
            <Card.Body className='p-0'>
              <Review review={review} reviewType={reviewType} />
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant='info' className='mt-4'>
          리뷰가 없습니다.
        </Alert>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
  reviewType: PropTypes.bool,
};

export default ReviewList;
