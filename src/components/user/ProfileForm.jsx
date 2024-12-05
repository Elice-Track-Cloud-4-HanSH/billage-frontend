import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const ProfileForm = ({ profile }) => {
  return (
    <div className='mt-4 px-5'>
      <div className='d-flex align-items-center mb-4 gap-4'>
        <img
          src={profile.imageUrl}
          alt='프로필 이미지'
          className='rounded-circle border'
          style={{ width: '180px', height: '180px' }}
        />
        <h2 className='ms-3 mb-0'>{profile.nickname}</h2>
      </div>

      <div className='d-flex justify-content-between mb-5 text-start'>
        <div>
          <h5>소개 글</h5>
          <div className='mt-3'>
            <textarea
              className='form-control bg-light rounded p-3'
              value={profile.description}
              readOnly
              rows={10}
              cols={40}
            />
          </div>
        </div>
        <div className='d-flex align-items-center mt-3'>
          <div className='position-relative'>
            <span className='fs-1 text-warning'>
              <FaStar size={250} />
              <span
                className='position-absolute top-50 start-50 translate-middle fs-1 text-dark fw-bold'
                style={{ fontSize: '100px' }}
              >
                {profile.avgScore.toFixed(1)}
              </span>{' '}
            </span>
          </div>
        </div>
      </div>

      <div className='d-flex align-items-center gap-1'>
        <span>받은 거래 후기 </span>
        <Badge bg='secondary' className='fs-6'>
          {profile.reviewCount}건
        </Badge>
      </div>
    </div>
  );
};

ProfileForm.propTypes = {
  profile: PropTypes.shape({
    imageUrl: PropTypes.string,
    nickname: PropTypes.string,
    description: PropTypes.string,
    avgScore: PropTypes.number,
    reviewCount: PropTypes.number,
  }),
};

export default ProfileForm;
