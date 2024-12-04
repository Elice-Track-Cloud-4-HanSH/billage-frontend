import PropTypes from 'prop-types';

const ReviewSubject = ({ subjectInfo, comment }) => {
  return (
    <div className='my-5 gap-5'>
      <div className='mb-5'>
        <img
          src={subjectInfo.imageUrl}
          alt='이미지'
          className='img-fluid rounded'
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
          }}
        />
        <h4 className='mt-3'>{subjectInfo.subject}</h4>
      </div>
      <div>
        <p className='text-muted'>{comment}</p>
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
