import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/user/ProfileEdit.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleComplete = () => {
    console.log('수정 완료', { name, bio, image });
    navigate(-1);
  };

  return (
    <div className="profile-edit">
      {/* Header */}
      <div className="profile-header">
        <button onClick={handleCancel} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>프로필 수정</h1>
      </div>

      {/* Profile Image Upload */}
      <div className="profile-image-container">
        <div className="profile-image-wrapper">
          <div className="profile-image">
            {image ? (
              <img src={image} alt="Profile" />
            ) : (
              <div className="profile-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </div>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="imageUpload" className="upload-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </label>
        </div>
      </div>

      {/* Input Fields */}
      <div className="input-container">
        <div>
          <input
            type="text"
            placeholder="김대여"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
        </div>
        <div>
          <textarea
            placeholder="안녕하세요.&#10;좋은 거래해요.&#10;가격 협의는 받지 않습니다."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bio-input"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="button-container">
      <button onClick={handleComplete} className="complete-button">
        수정 완료
      </button>
      <button onClick={handleCancel} className="cancel-button">
        회원 탈퇴
      </button>
      </div>
    </div>
  );
};

export default ProfileEdit;