import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password
      };
      console.log('로그인 시도:', loginData);

      const response = await axios.post('http://localhost:8080/api/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('로그인 응답:', response.data);
      
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <>
      <Header title="로그인" />
      <form onSubmit={handleLogin} style={styles.form}>
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
          <label>비밀번호</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">로그인</button>
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

export default Login;