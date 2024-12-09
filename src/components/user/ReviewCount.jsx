import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ReviewCount = ({ profile }) => {
  return (
    <div className='mt-4 px-5'>
      <div className='d-flex align-items-center gap-1'>
        <span>받은 거래 후기 </span>
        <Badge bg='secondary' className='fs-6'>
          {profile.reviewCount}건
        </Badge>
      </div>
    </div>
  );
};

ReviewCount.propTypes = {
  profile: PropTypes.shape({
    imageUrl: PropTypes.string,
    nickname: PropTypes.string,
    description: PropTypes.string,
    avgScore: PropTypes.number,
    reviewCount: PropTypes.number,
  }),
};

export default ReviewCount;
