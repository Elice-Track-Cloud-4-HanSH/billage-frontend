import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

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
      alert('인증 코드 발송에 실패했습니다.');
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
      <form onSubmit={handleSignup} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>닉네임</label>
          <input
            type='text'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>이메일</label>
          <div style={styles.rowGroup}>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.flexInput}
            />
            <button type='button' onClick={handleSendVerification} style={styles.button}>
              전송
            </button>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label>인증 코드</label>
          <div style={styles.rowGroup}>
            <input
              type='text'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              style={styles.flexInput}
            />
            <button type='button' onClick={handleVerifyEmail} style={styles.button}>
              인증
            </button>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type='password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <button type='submit' style={styles.submitButton}>
          회원가입
        </button>
      </form>
    </>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  rowGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  flexInput: {
    flex: 1,
  },
  button: {
    padding: '0.5rem 1rem',
    whiteSpace: 'nowrap',
  },
  submitButton: {
    padding: '0.75rem',
    marginTop: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Signup;
