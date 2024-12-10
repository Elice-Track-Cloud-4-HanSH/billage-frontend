import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import '@/styles/user/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  const handleSendVerification = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      await axios.post('/api/users/email-verification', { email });
      alert('인증 코드가 이메일로 발송되었습니다.');
    } catch (error) {
      // 에러 상세 정보 출력
      console.error('Error details:', error.response || error);
      if(error.response && error.response.status === 409) {
        alert('이미 등록된 이메일입니다.');
      } else {
        alert('인증 코드 발송에 실패했습니다.');
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }
    try {
      await axios.post('/api/users/verify-email', { email, code: verificationCode });
      setIsEmailVerified(true);
      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      alert('이메일 인증에 실패했습니다.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signupData = {
      email,
      nickname,
      password,
      provider: 'LOCAL',
      userRole: 'USER',
    };

    try {
      const response = await axios.post('/api/users/signup', signupData);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/signin');
    } catch (error) {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Header title='회원가입' />
      <div className='signup-container'>
        <form onSubmit={handleSignup} className='signup-form'>
          <h1 className='page-title'>BILLAGE</h1>
          <h1 className='page-title' style={{ fontSize: 'larger' }}>
            WELCOME
          </h1>

          <div className='input-group'>
            <input
              type='text'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className='text-input'
              placeholder='닉네임을 입력하세요'
            />
          </div>

          <div className='input-group'>
            <div className='row-group'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='text-input'
                placeholder='이메일을 입력하세요'
              />
              <button type='button' onClick={handleSendVerification} className='action-button'>
                전송
              </button>
            </div>
          </div>

          <div className='input-group'>
            <div className='row-group'>
              <input
                type='text'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className='text-input'
                placeholder='인증코드를 입력하세요'
              />
              <button type='button' onClick={handleVerifyEmail} className='action-button'>
                인증
              </button>
            </div>
          </div>

          <div className='input-group'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='text-input'
              placeholder='비밀번호를 입력하세요'
            />
          </div>

          <div className='input-group'>
            <input
              type='password'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className='text-input'
              placeholder='비밀번호를 다시 입력하세요'
            />
          </div>

          <button type='submit' className='submit-button'>
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
