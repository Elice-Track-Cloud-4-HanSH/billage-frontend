import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/styles/user/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  const handleSendEmail = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/users/email-verification-password', { email });
      alert('인증 코드가 이메일로 발송되었습니다.');
    } catch (error) {
      console.error('Error details:', error.response || error);
      alert('인증 코드 발송에 실패했습니다.');
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }
    try {
      await axios.post('/api/users/verify-email', {
        email,
        code: verificationCode,
      });
      setIsEmailVerified(true);
      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      console.error('Error details:', error.response || error);
      alert('이메일 인증에 실패했습니다.');
    }
  };

  const handleChangePassword = async () => {
    if (!isEmailVerified) {
      setError('먼저 이메일 인증을 완료해주세요.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post(
        '/api/users/check-password',
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/signin');
    } catch (error) {
      console.error('Error details:', error.response || error);
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div className='forgot-password-container'>
      <div className='forgot-password-card'>
        <h1 className='page-title'>BILLAGE</h1>
        <h1 className='page-title' style={{ fontSize: 'larger' }}>
          비밀번호 재설정
        </h1>

        {error && <div className='error-message'>{error}</div>}

        <div>
          <div className='input-container'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='text-input'
              placeholder='이메일을 입력하세요'
            />
            <button onClick={handleSendEmail} className='action-button'>
              전송
            </button>
          </div>
        </div>

        <div>
          <div className='input-container'>
            <input
              type='text'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className='text-input'
              placeholder='인증코드를 입력하세요'
            />
            <button onClick={handleVerifyEmail} className='action-button'>
              확인
            </button>
          </div>
        </div>

        <div>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='full-width-input'
            placeholder='새 비밀번호를 입력하세요'
          />
        </div>

        <div>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='full-width-input'
            placeholder='비밀번호를 다시 입력하세요'
          />
        </div>

        <button className='submit-button' onClick={handleChangePassword}>
          변경
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
