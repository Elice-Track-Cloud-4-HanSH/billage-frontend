import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const signupData = {
      email,
      nickname,
      password,
      provider: 'LOCAL',
      userRole: 'USER'
    };
    console.log('전송되는 데이터:', signupData); // 데이터 확인

    try {
      const response = await axios.post('/api/users/signup', signupData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data); // 에러 응답 데이터도 확인
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
};

  return (
    <>
      <Header title="회원가입" />
      <form onSubmit={handleSignup} style={styles.form}>
        <div>
          <label>이메일</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>닉네임</label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">회원가입</button>
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
  },
};

export default Signup;