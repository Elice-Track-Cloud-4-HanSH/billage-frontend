import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import googleLogo from '@/assets/Google__G__logo.svg';
import '@/styles/user/Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AXIOS_BASE_URL}/api/login`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      navigate('/after-login');
    } catch (error) {
      console.error('로그인 실패:', error);
      setError(
        error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_AXIOS_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className='login-page'>
      <div className='login-form-container'>
        <h1 className='login-form-title'>BILLAGE</h1>

        <form onSubmit={handleLogin} className='login-form'>
          {error && <div className='login-form-error'>{error}</div>}

          <div className='login-form-group'>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              value={formData.email}
              onChange={handleChange}
              className='login-form-input'
              placeholder='이메일'
            />
          </div>

          <div className='login-form-group'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              required
              value={formData.password}
              onChange={handleChange}
              className='login-form-input'
              placeholder='비밀번호'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='password-toggle'
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {/*</div>*/}
          </div>

          <div className='login-form-checkbox'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
              로그인 상태 유지
            </label>
          </div>

          <button type='submit' disabled={isLoading} className='login-form-button'>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className='google-login-button'>
          <img src={googleLogo} alt='Google logo' className='me-2' style={{ width: '20px' }} />
          Google로 계속하기
        </button>

        <div className='login-form-links'>
          <a href='/forgot-password'>비밀번호 찾기</a>
          <a href='/signup'>회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
