import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/styles/user/EditProfile.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/get-profile', {
          withCredentials: true
        });
        
        // 백엔드에서 받아온 데이터로 상태 업데이트
        setNickname(response.data.nickname);
        setImage(response.data.image_url);
        // description이 null일 수 있으므로 빈 문자열로 대체
        setDescription(response.data.description || '');
        
      } catch (error) {
        console.error('프로필 로딩 실패:', error);
        alert('프로필 정보를 불러오는데 실패했습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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

  const handleComplete = async () => {
    try {
      if (!nickname.trim()) {
        alert('닉네임은 필수입니다.');
        return;
      }

      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('description', description);
      if (image && image.startsWith('data:')) {
        const blob = await fetch(image).then(r => r.blob());
        formData.append('image', blob);
      }

      await axios.put('/api/users/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate(-1);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까?')) {
      return;
    }

    try {
      const response = await axios.delete('/api/users', {
        withCredentials: true
      });

      if (response.data.deleted) {
        window.location.href = 'http://localhost:3000/login';
      }
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="profile-edit">
      <div className="profile-header">
        <button onClick={handleCancel} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>프로필 수정</h1>
      </div>

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

      <div className="input-container">
        <div>
          <input
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="name-input"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="안녕하세요.&#10;좋은 거래해요.&#10;가격 협의는 받지 않습니다."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-input"
          />
        </div>
      </div>

      <div className="button-container">
        <button 
          onClick={handleComplete} 
          className="complete-button"
          disabled={!nickname.trim()}
        >
          수정 완료
        </button>
        <button onClick={handleDeleteUser} className="cancel-button">
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;