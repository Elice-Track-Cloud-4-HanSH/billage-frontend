import PropTypes from 'prop-types';

const ReviewSubject = ({ subjectInfo, comment }) => {
  return (
    <div>
      <div>
        <img src={subjectInfo.imageUrl} alt='이미지' />
        <h5>{subjectInfo.subject}</h5>
      </div>
      <div>
        <p>{comment}</p>
      </div>
    </div>
  );
};

ReviewSubject.propTypes = {
  comment: PropTypes.string,
  subjectInfo: PropTypes.shape({
    imageUrl: PropTypes.string,
    subject: PropTypes.string.isRequired,
  }),
};

export default ReviewSubject;
