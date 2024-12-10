import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ profile, mypage }) => {
  const nav = useNavigate();

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
        {mypage ? (
          <button
            onClick={() => nav('/edit-profile')}
            style={{ backgroundColor: '#6366F1', color: 'white' }}
          >
            프로필 수정
          </button>
        ) : null}
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
  mypage: PropTypes.bool,
};

export default ProfileForm;
